import type { CaseRecord } from "@/types";

export const cases: CaseRecord[] = [
  {
    id: "case-nimitz",
    title: "NIMITZ ENCOUNTER",
    summary:
      "November 2004. USS Nimitz Carrier Strike Group. Multiple Navy pilots and ship crew report sustained engagement with a tic-tac shaped object exhibiting anomalous acceleration and no visible propulsion. FLIR1 footage declassified 2017.",
    fileIds: ["uap-pdf-002", "uap-vid-002", "uap-img-001"],
  },
  {
    id: "case-gimbal-gofast",
    title: "GIMBAL / GOFAST INTERCEPTS",
    summary:
      "2014–2015. East Coast airspace. F/A-18 aircrew capture two separate UAP encounters on infrared sensors. Objects exhibit non-ballistic flight paths, no heat signature, no visible control surfaces. DIA briefing appended.",
    fileIds: ["uap-vid-001", "uap-vid-003", "uap-pdf-004"],
  },
  {
    id: "case-aaro-review",
    title: "AARO ANNUAL REVIEW — 2023",
    summary:
      "All-domain Anomaly Resolution Office historical report covering incidents from 1945 to present. Pentagon briefing slides and 2019 Gulf of Mexico thermal intercept included as supporting exhibits.",
    fileIds: ["uap-pdf-003", "uap-img-003", "uap-pdf-001", "uap-img-002"],
  },
  {
    id: "case-recovered-materials",
    title: "RECOVERED MATERIALS — WRIGHT-PAT",
    summary:
      "Classified materials analysis from Wright-Patterson AFB. Shape analysis report and 2022 Middle East spherical object photographs included. USS Kearsarge triangulated photo appended as corroborating imagery.",
    fileIds: [
      "uap-pdf-006",
      "uap-pdf-005",
      "uap-img-004",
      "uap-img-005",
    ],
  },
];

export const casesByFileId: Record<string, CaseRecord> = {};
for (const c of cases) {
  for (const fid of c.fileIds) {
    casesByFileId[fid] = c;
  }
}
