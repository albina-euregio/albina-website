import { readFileSync, writeFileSync, readdirSync, existsSync, read } from "fs";
import { join } from "path";
import * as types from  "./types/QFA";
import fetch from "node-fetch";

/**
 * @class QFA
 * @classdesc Class for converting QFA files to JSON
 * @param filename - The path to the source txt weather file
 * @param url - The URL to the source txt weather file
 * @param data - The data extracted from the source txt weather file
 * @param coordinates - The coordinates of the grid point
 * @param height - The height of the grid point above sea level
 * @param metadata - The metadata of a file
 * @param parameters - The weather parameters
 * @param loadFromJSON - Loads data from a parsed JSON file
 * @param loadFromFile - Loads a txt weather file from the filesystem
 * @param loadFromURL - Loads a txt weather file from a URL
 * @param listParameters - Lists the parameters in the weather file
 * @param dump - Dumps the file to the filesystem
 * @returns {QFA}
 * @example
 * import { QFA } from "qfa";
 * const qfa = new QFA();
 * qfa.loadFromFile("path/to/file.txt");
 * console.log(qfa.listParameters());
 * qfa.dump("path/to/file.json");
 * @example
 * import { QFA } from "qfa";
 * (async () => {
 *    const qfa = new QFA();
 *    await qfa.loadFromURL("https://example.com/file.txt");
 *    console.log(qfa.listParameters());
 *    qfa.dump("path/to/file.json");
 * })();
 * @example
 * import { QFA } from "qfa";
 * const qfa = new QFA();
 * qfa.loadFromJSON("path/to/file.json");
 * console.log(qfa.listParameters());
 */
export class QFA implements types.QFA {
    private qfaDir = "./files";
    private logDir = "./logs";
    private basename = "";
    public data = {} as types.data;

    constructor(directory?: string) {
        this.qfaDir = directory || this.qfaDir;
    }

    get coordinates() {
        return this.data.metadata.coords;
    }

    get height () {
        return this.data.metadata.height;
    }

    get metadata() {
        return this.data.metadata;
    }

    get parameters() {
        return this.data.parameters;
    }

    get filename() {
        return `${this.logDir}/${this.basename}.json`;
    }

    public listParameters() {
        return Object.keys(this.data.parameters);
    }

    public loadFromJSON = (filename: string): boolean => {
        const file = join(__dirname, filename);
        if(existsSync(file)) {
            const data = readFileSync(file, "ascii");
            this.data = JSON.parse(data);
            return true;
        }
        return false;
    }

    public loadFromURL = async (url: string) => {
        const filename = url.split("/").pop() || "";
        this.basename = filename.split(".").shift() || "";

        if(this.loadFromJSON(`${this.logDir}/${this.basename}.json`)) return;

        const response = await fetch(url, {
            method: "GET",
        });
        const html = await response.text();
        this.data = this.parseText(html);
    }

    public loadFromFile = (filename:string) => {
        this.basename = filename.split(".")[0];
        if(this.loadFromJSON(`${this.logDir}/${this.basename}.json`)) return;

        const content: string = readFileSync(join(__dirname, filename), "ascii");
        this.data = this.parseText(content);
    }

    private parseMetaData = (plainText: string): types.metadata => {
        const plainMetadata = plainText.split("=======================================================================================")[0];
        const data = plainMetadata.split(/[\s]{2,}/g);

        const days = data[9].match(/\d/g);
        const nDays = Number(days![1]) - Number(days![0] || 0) + 1;
        const date = this.parseDate(data[6]);

        const parameters: types.metadata = {
            location: data[1],
            coords: {
                lat: Number(data[2]),
                lon: Number(data[3]),
            },
            height: Number(data[4]),
            orog: Number(data[5].match(/[\d]+/g)),
            date: date,
            timezone: data[7].split(" ")[1],
            model: data[8],
            days: nDays
        }
        return parameters
    }

    private parseDate = (date: string): Date => {
        const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        const day = Number(date.match(/[\d]+/));
        const month = months.filter(month => date.includes(month))[0];
        const year = Number(date.match(/[\d]{4}/));
        const parameters = new Date(year, months.indexOf(month), day);
        return parameters;
    }

    private parseParameters = (plainText: string): types.parameters => {
        let data = plainText.split("=======================================================================================")[1]
        data = data.replace("=", "");
        // data = data.replace(/[\s]{2,}/g, " ");
        data = data.replace(/[-]{5,}\|/g, "");
        const allLines = data.split("\n");
        const plainDates = allLines[1].split(" |");
        const dates = [
            this.parseDate(plainDates[1]),
            this.parseDate(plainDates[2]),
            this.parseDate(plainDates[3]),
        ]
        const dateStrings = dates.map(el => el.toISOString().split('T')[0]);
        const lines = allLines.filter((el, i) => el !== '' && i > 3);

        const parameters = {} as types.parameters;
        for(const line of lines) {
            let sub = line.substring(0, line.length - 2);
            sub = sub.replace(/[\s]{24,}/g, " --- --- --- --- ");
            sub = sub.replace(/[\s]{18,}/g, " --- --- ---");
            sub = sub.replace(/[\s]{12,}/g, " --- --- ");
            sub = sub.replace(/[\s]{6,}/g, " --- ");
            sub = sub.replace(/[\s]+/g, " ");
            // console.log(sub);
            const cols = sub.split(" | ");
            // console.log(cols);

            const partial = {}
            for(const [strKey, value] of Object.entries(dateStrings)) {
                // console.log(key, value)
                const key = parseInt(strKey) + 1;
                // console.log(key);
                partial[value] = {
                    "00": cols[key].split(" ")[0],
                    "06": cols[key].split(" ")[1],
                    "12": cols[key].split(" ")[2],
                    "18": cols[key].split(" ")[3],
                }
            }
            const parameterName = cols[0].split(" ---")[0];
            parameters[parameterName] = partial;
        }

        return parameters;
    }

    private parseText = (plainText: string) =>  {
        const metadata = this.parseMetaData(plainText);
        const parameters = this.parseParameters(plainText);
        
        const result = {
            metadata,
            parameters,
        }

        return result;
    }

    public dump = (filename?: string) => {
        const file = join(__dirname, `${this.logDir}/${filename || this.basename}.json`);
        writeFileSync(file, JSON.stringify(this.data, null, 4));
    }
}

export class MarkerData implements types.MarkerData {
    private filename = join(__dirname, "./markers.json")
    public data = {} as types.markers;

    constructor(filename?: string) {
        this.filename = filename ? join(__dirname, filename) : this.filename;
        this.load();
    }

    private load() {
        if(existsSync(join(__dirname, "./markers.json"))) {
            const data = readFileSync(this.filename, "ascii");
            if(data) this.data = JSON.parse(data);
        }
    }

    public add(marker: types.marker) {
        const key = `${marker.coordinates.lon}:${marker.coordinates.lat}`;
        if(key in this.data) {
            if(!(marker.filename in this.data[key].filenames)) {
                this.data[key].filenames.push(marker.filename);
            }
        } else {
            this.data[key] = {
                coordinates: marker.coordinates,
                filenames: [
                    marker.filename
                ]
            }
        }
    }

    public get coordinates(): types.coordinates[] {
        const coordinates = Object.values(this.data).map(el => el.coordinates);
        return coordinates;
    }

    public getFilenames(coordinates: types.coordinates): string[] {
        const key = `${coordinates.lon}:${coordinates.lat}`;
        return this.data[key].filenames;
    }

    public save() {
        writeFileSync(this.filename, JSON.stringify(this.data, null, 4));
    }
}

export const getFilenames = async(baseurl: string): Promise<string[]> =>   {
    const logFile = join(__dirname, "./lastFilename.log")

    const response = await fetch(baseurl, {
        method: "GET",
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        }
    });

    const html = await response.text();

    let lastFilename = undefined as unknown;
    if(existsSync(logFile)) {
        lastFilename = readFileSync(logFile, "ascii");
    }

    const regex = /<td>\n\t{7}<a href="(.*)">/g;
    const filenames = [] as string[];
    let match = regex.exec(html);
    while (match) {
        if(match[1] === lastFilename) break;
        filenames.push(match[1]);
        match = regex.exec(html);
    }
    filenames.shift();
    lastFilename = filenames[0] || lastFilename;
    writeFileSync(logFile, lastFilename);
    //remove first two chars from each filename
    const result = filenames.map(el => el.substring(2));
    const urls = result.map(filename => `${baseurl}/${filename}`);
    return urls;
}


//main
(async () => {
    const urls = await getFilenames("https://static.avalanche.report/zamg_qfa");
    
    const markerData = new MarkerData();
    
    console.log("fetching data...");

    for(const [i, url]  of Object.entries(urls)) {
        const tempQFA = new QFA();
        await tempQFA.loadFromURL(url);
        tempQFA.dump();
        markerData.add({
            filename: tempQFA.filename,
            coordinates: tempQFA.coordinates
        });
        
        process.stdout.write(`\rFetched ${parseInt(i)+1}/${urls.length} files (${Math.round(((parseInt(i) + 1) / urls.length)*100)}%)`);
    }

    markerData.save();

    console.log("\ndone");
    const filenames = markerData.getFilenames(markerData.coordinates[0]);
    const qfa = new QFA();
    qfa.loadFromJSON(filenames[0]);
    console.log(qfa.listParameters());
})();