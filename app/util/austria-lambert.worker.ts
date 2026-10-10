import {
  type AustriaLambertGridData,
  reprojectAustriaLambertImage
} from "./austria-lambert";

export interface ReprojectionRequest {
  id: number;
  image: ImageBitmap;
  grid: AustriaLambertGridData;
}

export type ReprojectionResponse =
  | { id: number; image: ImageData }
  | { id: number; error: string };

self.onmessage = ({ data }: MessageEvent<ReprojectionRequest>) => {
  let response: ReprojectionResponse;
  try {
    response = {
      id: data.id,
      image: reprojectAustriaLambertImage(data.image, data.grid)
    };
  } catch (e) {
    response = { id: data.id, error: String(e) };
  } finally {
    data.image.close();
  }
  self.postMessage(response, {
    transfer: "image" in response ? [response.image.data.buffer] : []
  });
};
