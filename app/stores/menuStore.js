export default class MenuStore {
  constructor() {
    this.en = {
      "footer-main": [
        {
          id: "9574d51a-a756-4241-9e52-c686c9746f40",
          title: "Avalanche Forecast",
          url: "/bulletin"
        },
        {
          id: "cebe9b6f-6ba2-448f-b855-0369d689e436",
          title: "Blog",
          url: "/blog"
        },
        {
          id: "11eb3d19-87d7-4c0f-ba74-4c718c93bd47",
          title: "Snow & Weather",
          url: "/weather"
        },
        {
          id: "33564b48-4064-400e-ae36-531d30cb9e89",
          title: "Education & Prevention",
          url: "/education"
        },
        {
          id: "d083ce35-7bab-4d5d-9e42-5b65a8993ea3",
          title: "More",
          url: "/more"
        }
      ],
      footer: [
        {
          id: "f4614627-140a-4ec1-b790-57decf549a58",
          title: "Archive",
          url: "/archive"
        },
        {
          id: "31f06a50-ea8e-4931-a7a3-3db5b494c45d",
          title: "About",
          url: "/about"
        },
        {
          id: "db2f38c8-55fa-4aa6-acdb-c4baf8a93cd8",
          title: "Contact",
          url: "/contact"
        },
        {
          id: "e1183cf6-20c7-4fd1-86e8-043a32ae65e4",
          title: "Imprint",
          url: "/imprint"
        }
      ],
      main: [
        {
          id: "2e3d4f21-662f-4a7f-8fcd-8e4beb335924",
          title: "Avalanche Forecast",
          url: "/bulletin"
        },
        {
          id: "c6720b87-1cb2-441e-904b-87a369c6d696",
          title: "Blog",
          url: "/blog"
        },
        {
          id: "e7b73642-6f85-4cfc-a26e-a8560c0f5ad4",
          title: "Snow & Weather",
          url: "/weather",
          children: [
            {
              id: "5801a9a9-4615-4c24-b37c-e408f12710e4",
              title: "Weather Maps",
              url: "/weather/map/"
            },
            {
              id: "1c55ad27-8780-4559-92ca-29057ff0f3f9",
              title: "Station Measurements",
              url: "/weather/measurements"
            },
            {
              id: "0ed767d7-7abd-4b0e-86a9-fbf93a0ea9c7",
              title: "Weather Stations",
              url: "https://www.lawis.at/station?lang=de"
            },
            {
              id: "ae8e3c2d-a698-4947-9d0d-eeb23a0abda3",
              title: "Snow Profiles",
              url: "https://www.lawis.at/profile?lang=de"
            },
            {
              id: "d6c1f5c0-dac3-420b-8aa8-379ba9be1e15",
              title: "Webcams",
              url: "https://www.foto-webcam.eu"
            }
          ]
        },
        {
          id: "3bddc1a3-6f7d-4293-8a06-daf1c484c0b7",
          title: "Education & Prevention",
          url: "/education",
          children: [
            {
              id: "d7cf025c-8a18-412f-b8ff-3064ac257796",
              title: "Danger Scale",
              url: "/education/dangerscale"
            },
            {
              id: "714ded0d-3c91-4273-b492-709eb639a505",
              title: "Avalanche Problems",
              url: "/education/avp"
            },
            {
              id: "207ca6cc-7408-40ce-b7ef-dadb76479b40",
              title: "EAWS Matrix",
              url: "/education/matrix"
            },
            {
              id: "205ce14f-cbd3-4786-80d5-88b6ca477e32",
              title: "Avalanche Sizes",
              url: "/education/avalanche-sizes"
            },
            {
              id: "6c5268ba-03ac-4b14-a6fe-381146089c8a",
              title: "Danger Patterns",
              url: "/education/danger-patterns"
            },
            {
              id: "446dc068-7448-4f1a-957a-c99e9b0a3fe4",
              title: "Glossary",
              url: "https://www.avalanches.org/glossary-2/"
            },
            {
              id: "cb0cdb40-8687-49f2-af8b-fd24aeebe01a",
              title: "Handbook",
              url: "/education/handbook"
            }
          ]
        },
        {
          id: "7d58f306-9cb6-418e-9f21-356c90078178",
          title: "More",
          url: "/more",
          children: [
            {
              id: "68d2df1e-ae42-4fa1-94e1-f8f1eab9a11d",
              title: "Archive",
              url: "/archive"
            },
            {
              id: "14ba0fe7-123e-44a3-9188-38e1667cad10",
              title: "About",
              url: "/about"
            },
            {
              id: "894ba9f4-e88d-4c8d-8dc9-29b7e5f519d7",
              title: "Contact",
              url: "/contact"
            },
            {
              id: "8a38569a-d278-4a2e-afb3-bde4589e1791",
              title: "Imprint",
              url: "/imprint"
            },
            {
              id: "59cb8621-bfd8-4357-abd3-875ae8a561cf",
              title: "Privacy Policy",
              url: "/privacy"
            }
          ]
        }
      ]
    };
    this.de = {
      "footer-main": [
        {
          id: "9574d51a-a756-4241-9e52-c686c9746f40",
          title: "Lawinenvorhersage",
          url: "/bulletin"
        },
        {
          id: "cebe9b6f-6ba2-448f-b855-0369d689e436",
          title: "Blog",
          url: "/blog"
        },
        {
          id: "11eb3d19-87d7-4c0f-ba74-4c718c93bd47",
          title: "Schnee & Wetter",
          url: "/weather"
        },
        {
          id: "33564b48-4064-400e-ae36-531d30cb9e89",
          title: "Ausbildung & Prävention",
          url: "/education"
        },
        {
          id: "d083ce35-7bab-4d5d-9e42-5b65a8993ea3",
          title: "Mehr",
          url: "/more"
        }
      ],
      footer: [
        {
          id: "f4614627-140a-4ec1-b790-57decf549a58",
          title: "Archiv",
          url: "/archive"
        },
        {
          id: "31f06a50-ea8e-4931-a7a3-3db5b494c45d",
          title: "Über uns",
          url: "/about"
        },
        {
          id: "db2f38c8-55fa-4aa6-acdb-c4baf8a93cd8",
          title: "Kontakt",
          url: "/contact"
        },
        {
          id: "e1183cf6-20c7-4fd1-86e8-043a32ae65e4",
          title: "Impressum",
          url: "/imprint"
        }
      ],
      main: [
        {
          id: "2e3d4f21-662f-4a7f-8fcd-8e4beb335924",
          title: "Lawinenvorhersage",
          url: "/bulletin"
        },
        {
          id: "c6720b87-1cb2-441e-904b-87a369c6d696",
          title: "Blog",
          url: "/blog"
        },
        {
          id: "e7b73642-6f85-4cfc-a26e-a8560c0f5ad4",
          title: "Schnee & Wetter",
          url: "/weather",
          children: [
            {
              id: "5801a9a9-4615-4c24-b37c-e408f12710e4",
              title: "Wetterkarten",
              url: "/weather/map/"
            },
            {
              id: "1c55ad27-8780-4559-92ca-29057ff0f3f9",
              title: "Stationsmesswerte",
              url: "/weather/measurements"
            },
            {
              id: "0ed767d7-7abd-4b0e-86a9-fbf93a0ea9c7",
              title: "Wetterstationen",
              url: "https://www.lawis.at/station?lang=de"
            },
            {
              id: "ae8e3c2d-a698-4947-9d0d-eeb23a0abda3",
              title: "Schneeprofile",
              url: "https://www.lawis.at/profile?lang=de"
            },
            {
              id: "d6c1f5c0-dac3-420b-8aa8-379ba9be1e15",
              title: "Webcams",
              url: "https://www.foto-webcam.eu"
            }
          ]
        },
        {
          id: "3bddc1a3-6f7d-4293-8a06-daf1c484c0b7",
          title: "Ausbildung & Prävention",
          url: "/education",
          children: [
            {
              id: "d7cf025c-8a18-412f-b8ff-3064ac257796",
              title: "Lawinengefahrenstufen",
              url: "/education/dangerscale"
            },
            {
              id: "714ded0d-3c91-4273-b492-709eb639a505",
              title: "Lawinenprobleme",
              url: "/education/avp"
            },
            {
              id: "207ca6cc-7408-40ce-b7ef-dadb76479b40",
              title: "EAWS-Matrix",
              url: "/education/matrix"
            },
            {
              id: "205ce14f-cbd3-4786-80d5-88b6ca477e32",
              title: "Lawinengrößen",
              url: "/education/avalanche-sizes"
            },
            {
              id: "6c5268ba-03ac-4b14-a6fe-381146089c8a",
              title: "Gefahrenmuster",
              url: "/education/danger-patterns"
            },
            {
              id: "446dc068-7448-4f1a-957a-c99e9b0a3fe4",
              title: "Glossar",
              url: "https://www.avalanches.org/glossary-2/"
            },
            {
              id: "cb0cdb40-8687-49f2-af8b-fd24aeebe01a",
              title: "Handbuch",
              url: "/education/handbook"
            }
          ]
        },
        {
          id: "7d58f306-9cb6-418e-9f21-356c90078178",
          title: "Mehr",
          url: "/more",
          children: [
            {
              id: "68d2df1e-ae42-4fa1-94e1-f8f1eab9a11d",
              title: "Archiv",
              url: "/archive"
            },
            {
              id: "14ba0fe7-123e-44a3-9188-38e1667cad10",
              title: "Über uns",
              url: "/about"
            },
            {
              id: "894ba9f4-e88d-4c8d-8dc9-29b7e5f519d7",
              title: "Kontakt",
              url: "/contact"
            },
            {
              id: "8a38569a-d278-4a2e-afb3-bde4589e1791",
              title: "Impressum",
              url: "/imprint"
            },
            {
              id: "59cb8621-bfd8-4357-abd3-875ae8a561cf",
              title: "Datenschutzerklärung",
              url: "/privacy"
            }
          ]
        }
      ]
    };
    this.it = {
      "footer-main": [
        {
          id: "9574d51a-a756-4241-9e52-c686c9746f40",
          title: "Bollettino valanghe",
          url: "/bulletin"
        },
        {
          id: "cebe9b6f-6ba2-448f-b855-0369d689e436",
          title: "Blog",
          url: "/blog"
        },
        {
          id: "11eb3d19-87d7-4c0f-ba74-4c718c93bd47",
          title: "Neve & Meteo",
          url: "/weather"
        },
        {
          id: "33564b48-4064-400e-ae36-531d30cb9e89",
          title: "Educazione & Prevenzione",
          url: "/education"
        },
        {
          id: "d083ce35-7bab-4d5d-9e42-5b65a8993ea3",
          title: "More",
          url: "/more"
        }
      ],
      footer: [
        {
          id: "f4614627-140a-4ec1-b790-57decf549a58",
          title: "Archivio",
          url: "/archive"
        },
        {
          id: "31f06a50-ea8e-4931-a7a3-3db5b494c45d",
          title: "Chi siamo",
          url: "/about"
        },
        {
          id: "db2f38c8-55fa-4aa6-acdb-c4baf8a93cd8",
          title: "Contact",
          url: "/contact"
        },
        {
          id: "e1183cf6-20c7-4fd1-86e8-043a32ae65e4",
          title: "Impressum",
          url: "/imprint"
        }
      ],
      main: [
        {
          id: "2e3d4f21-662f-4a7f-8fcd-8e4beb335924",
          title: "Bollettino Valanghe",
          url: "/bulletin"
        },
        {
          id: "c6720b87-1cb2-441e-904b-87a369c6d696",
          title: "Blog",
          url: "/blog"
        },
        {
          id: "e7b73642-6f85-4cfc-a26e-a8560c0f5ad4",
          title: "Neve & Meteo",
          url: "/weather",
          children: [
            {
              id: "5801a9a9-4615-4c24-b37c-e408f12710e4",
              title: "Carte Meteo",
              url: "/weather/map/"
            },
            {
              id: "1c55ad27-8780-4559-92ca-29057ff0f3f9",
              title: "Dati di Stazioni Meteo",
              url: "/weather/measurements"
            },
            {
              id: "0ed767d7-7abd-4b0e-86a9-fbf93a0ea9c7",
              title: "Stazioni Meteorologiche",
              url: "https://www.lawis.at/station?lang=de"
            },
            {
              id: "ae8e3c2d-a698-4947-9d0d-eeb23a0abda3",
              title: "Profili Manto Nevoso",
              url: "https://www.lawis.at/profile?lang=de"
            },
            {
              id: "d6c1f5c0-dac3-420b-8aa8-379ba9be1e15",
              title: "Webcams",
              url: "https://www.foto-webcam.eu"
            }
          ]
        },
        {
          id: "3bddc1a3-6f7d-4293-8a06-daf1c484c0b7",
          title: "Educazione & Prevenzione",
          url: "/education",
          children: [
            {
              id: "d7cf025c-8a18-412f-b8ff-3064ac257796",
              title: "Scala del Pericolo",
              url: "/education/dangerscale"
            },
            {
              id: "714ded0d-3c91-4273-b492-709eb639a505",
              title: "Problemi Tipici Valanghivi",
              url: "/education/avp"
            },
            {
              id: "207ca6cc-7408-40ce-b7ef-dadb76479b40",
              title: "EAWS-Matrice",
              url: "/education/matrix"
            },
            {
              id: "205ce14f-cbd3-4786-80d5-88b6ca477e32",
              title: "Dimensione Valanghe",
              url: "/education/avalanche-sizes"
            },
            {
              id: "6c5268ba-03ac-4b14-a6fe-381146089c8a",
              title: "Situazioni Tipo",
              url: "/education/danger-patterns"
            },
            {
              id: "446dc068-7448-4f1a-957a-c99e9b0a3fe4",
              title: "Glossario",
              url: "https://www.avalanches.org/glossary-2/"
            },
            {
              id: "cb0cdb40-8687-49f2-af8b-fd24aeebe01a",
              title: "Manuale",
              url: "/education/handbook"
            }
          ]
        },
        {
          id: "7d58f306-9cb6-418e-9f21-356c90078178",
          title: "Altro",
          url: "/more",
          children: [
            {
              id: "68d2df1e-ae42-4fa1-94e1-f8f1eab9a11d",
              title: "Archivio",
              url: "/archive"
            },
            {
              id: "14ba0fe7-123e-44a3-9188-38e1667cad10",
              title: "Chi siamo",
              url: "/about"
            },
            {
              id: "894ba9f4-e88d-4c8d-8dc9-29b7e5f519d7",
              title: "Contatti",
              url: "/contact"
            },
            {
              id: "8a38569a-d278-4a2e-afb3-bde4589e1791",
              title: "Impressum",
              url: "/imprint"
            },
            {
              id: "59cb8621-bfd8-4357-abd3-875ae8a561cf",
              title: "Informativa sulla privacy",
              url: "/privacy"
            }
          ]
        }
      ]
    };
  }

  getMenu(menuId) {
    const lang = window["appStore"].language;
    return this[lang][menuId];
  }
}
