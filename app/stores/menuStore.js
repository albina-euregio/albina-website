export default class MenuStore {
  constructor() {
    this.en = {
      "footer-main": [
        {
          title: "Avalanche Forecast",
          url: "/bulletin"
        },
        {
          title: "Blog",
          url: "/blog"
        },
        {
          title: "Snow & Weather",
          url: "/weather"
        },
        {
          title: "Education & Prevention",
          url: "/education"
        },
        {
          title: "More",
          url: "/more"
        }
      ],
      footer: [
        {
          title: "Archive",
          url: "/archive"
        },
        {
          title: "About",
          url: "/about"
        },
        {
          title: "Contact",
          url: "/contact"
        },
        {
          title: "Imprint",
          url: "/imprint"
        }
      ],
      main: [
        {
          title: "Avalanche Forecast",
          url: "/bulletin"
        },
        {
          title: "Blog",
          url: "/blog"
        },
        {
          title: "Snow & Weather",
          url: "/weather",
          children: [
            {
              title: "Weather Maps",
              url: "/weather/map/"
            },
            {
              title: "Station Measurements",
              url: "/weather/measurements"
            },
            {
              title: "Weather Stations",
              url: "https://www.lawis.at/station?lang=de"
            },
            {
              title: "Snow Profiles",
              url: "https://www.lawis.at/profile?lang=de"
            },
            {
              title: "Webcams",
              url: "https://www.foto-webcam.eu"
            }
          ]
        },
        {
          title: "Education & Prevention",
          url: "/education",
          children: [
            {
              title: "Danger Scale",
              url: "/education/dangerscale"
            },
            {
              title: "Avalanche Problems",
              url: "/education/avp"
            },
            {
              title: "EAWS Matrix",
              url: "/education/matrix"
            },
            {
              title: "Avalanche Sizes",
              url: "/education/avalanche-sizes"
            },
            {
              title: "Danger Patterns",
              url: "/education/danger-patterns"
            },
            {
              title: "Glossary",
              url: "https://www.avalanches.org/glossary-2/"
            },
            {
              title: "Handbook",
              url: "/education/handbook"
            }
          ]
        },
        {
          title: "More",
          url: "/more",
          children: [
            {
              title: "Archive",
              url: "/archive"
            },
            {
              title: "About",
              url: "/about"
            },
            {
              title: "Contact",
              url: "/contact"
            },
            {
              title: "Imprint",
              url: "/imprint"
            },
            {
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
          title: "Lawinenvorhersage",
          url: "/bulletin"
        },
        {
          title: "Blog",
          url: "/blog"
        },
        {
          title: "Schnee & Wetter",
          url: "/weather"
        },
        {
          title: "Ausbildung & Prävention",
          url: "/education"
        },
        {
          title: "Mehr",
          url: "/more"
        }
      ],
      footer: [
        {
          title: "Archiv",
          url: "/archive"
        },
        {
          title: "Über uns",
          url: "/about"
        },
        {
          title: "Kontakt",
          url: "/contact"
        },
        {
          title: "Impressum",
          url: "/imprint"
        }
      ],
      main: [
        {
          title: "Lawinenvorhersage",
          url: "/bulletin"
        },
        {
          title: "Blog",
          url: "/blog"
        },
        {
          title: "Schnee & Wetter",
          url: "/weather",
          children: [
            {
              title: "Wetterkarten",
              url: "/weather/map/"
            },
            {
              title: "Stationsmesswerte",
              url: "/weather/measurements"
            },
            {
              title: "Wetterstationen",
              url: "https://www.lawis.at/station?lang=de"
            },
            {
              title: "Schneeprofile",
              url: "https://www.lawis.at/profile?lang=de"
            },
            {
              title: "Webcams",
              url: "https://www.foto-webcam.eu"
            }
          ]
        },
        {
          title: "Ausbildung & Prävention",
          url: "/education",
          children: [
            {
              title: "Lawinengefahrenstufen",
              url: "/education/dangerscale"
            },
            {
              title: "Lawinenprobleme",
              url: "/education/avp"
            },
            {
              title: "EAWS-Matrix",
              url: "/education/matrix"
            },
            {
              title: "Lawinengrößen",
              url: "/education/avalanche-sizes"
            },
            {
              title: "Gefahrenmuster",
              url: "/education/danger-patterns"
            },
            {
              title: "Glossar",
              url: "https://www.avalanches.org/glossary-2/"
            },
            {
              title: "Handbuch",
              url: "/education/handbook"
            }
          ]
        },
        {
          title: "Mehr",
          url: "/more",
          children: [
            {
              title: "Archiv",
              url: "/archive"
            },
            {
              title: "Über uns",
              url: "/about"
            },
            {
              title: "Kontakt",
              url: "/contact"
            },
            {
              title: "Impressum",
              url: "/imprint"
            },
            {
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
          title: "Bollettino valanghe",
          url: "/bulletin"
        },
        {
          title: "Blog",
          url: "/blog"
        },
        {
          title: "Neve & Meteo",
          url: "/weather"
        },
        {
          title: "Educazione & Prevenzione",
          url: "/education"
        },
        {
          title: "More",
          url: "/more"
        }
      ],
      footer: [
        {
          title: "Archivio",
          url: "/archive"
        },
        {
          title: "Chi siamo",
          url: "/about"
        },
        {
          title: "Contact",
          url: "/contact"
        },
        {
          title: "Impressum",
          url: "/imprint"
        }
      ],
      main: [
        {
          title: "Bollettino Valanghe",
          url: "/bulletin"
        },
        {
          title: "Blog",
          url: "/blog"
        },
        {
          title: "Neve & Meteo",
          url: "/weather",
          children: [
            {
              title: "Carte Meteo",
              url: "/weather/map/"
            },
            {
              title: "Dati di Stazioni Meteo",
              url: "/weather/measurements"
            },
            {
              title: "Stazioni Meteorologiche",
              url: "https://www.lawis.at/station?lang=de"
            },
            {
              title: "Profili Manto Nevoso",
              url: "https://www.lawis.at/profile?lang=de"
            },
            {
              title: "Webcams",
              url: "https://www.foto-webcam.eu"
            }
          ]
        },
        {
          title: "Educazione & Prevenzione",
          url: "/education",
          children: [
            {
              title: "Scala del Pericolo",
              url: "/education/dangerscale"
            },
            {
              title: "Problemi Tipici Valanghivi",
              url: "/education/avp"
            },
            {
              title: "EAWS-Matrice",
              url: "/education/matrix"
            },
            {
              title: "Dimensione Valanghe",
              url: "/education/avalanche-sizes"
            },
            {
              title: "Situazioni Tipo",
              url: "/education/danger-patterns"
            },
            {
              title: "Glossario",
              url: "https://www.avalanches.org/glossary-2/"
            },
            {
              title: "Manuale",
              url: "/education/handbook"
            }
          ]
        },
        {
          title: "Altro",
          url: "/more",
          children: [
            {
              title: "Archivio",
              url: "/archive"
            },
            {
              title: "Chi siamo",
              url: "/about"
            },
            {
              title: "Contatti",
              url: "/contact"
            },
            {
              title: "Impressum",
              url: "/imprint"
            },
            {
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
