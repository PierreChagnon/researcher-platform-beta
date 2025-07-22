import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function objectToFormData(obj) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

export const handleDownloadDocx = ({
  profileData = {},
  cvData = {},
  categorizedPublications = [],
  categorizedPresentations = [],
  categorizedTeachings = [],
}) => {
  // Fonction utilitaire pour générer un heading
  const heading = (text, level = 1) =>
    new Paragraph({
      text,
      heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][level - 1] || HeadingLevel.HEADING_1,
      spacing: { after: 150, before: 150 },
    })

  // Bloc d'en-tête du CV
  const headerBlock = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: profileData?.name || "Your Name",
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        profileData?.institution ? new TextRun(profileData.institution + " | ") : null,
        profileData?.location ? new TextRun(profileData.location + " | ") : null,
        profileData?.email ? new TextRun(profileData.email + " | ") : null,
        profileData?.phone ? new TextRun(profileData.phone + " | ") : null,
        profileData?.website ? new TextRun(profileData.website) : null,
      ].filter(Boolean),
      spacing: { after: 200 },
    }),
  ]

  // Academic Positions
  const positionsBlock =
    (cvData.positions?.length || 0) > 0
      ? [
        heading("Academic Positions", 2),
        ...cvData.positions
          .sort((a, b) => (b.startYear || 0) - (a.startYear || 0))
          .map((pos) =>
            new Paragraph({
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: `${pos.startYear || ""}${pos.endYear ? ` - ${pos.endYear}` : ""}: ${pos.title || ""}`,
                  bold: true,
                }),
                new TextRun({
                  text: pos.institution ? `, ${pos.institution}` : "",
                }),
                new TextRun({
                  text: pos.location ? ` (${pos.location})` : "",
                }),
                new TextRun({
                  text: pos.description ? `\n${pos.description}` : "",
                  break: 1,
                }),
              ],
            })
          ),
      ]
      : []

  // Education
  const educationBlock =
    (cvData.education?.length || 0) > 0
      ? [
        heading("Education", 2),
        ...cvData.education
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .map((edu) =>
            new Paragraph({
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: `${edu.degree || ""}, ${edu.institution || ""}`,
                  bold: true,
                }),
                new TextRun({
                  text: edu.location ? `, ${edu.location}` : "",
                }),
                new TextRun({
                  text: edu.year ? ` (${edu.year})` : "",
                }),
                new TextRun({
                  text: edu.description ? `\n${edu.description}` : "",
                  break: 1,
                }),
              ],
            })
          ),
      ]
      : []

  // Funding / Awards
  const fundingBlock =
    (cvData.funding?.length || 0) > 0
      ? [
        heading("Research Funding & Awards", 2),
        ...cvData.funding
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .map((fund) =>
            new Paragraph({
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: `${fund.year || ""}: ${fund.title || ""}`,
                  bold: true,
                }),
                new TextRun({
                  text: fund.agency ? `, ${fund.agency}` : "",
                }),
                new TextRun({
                  text: fund.role ? `, ${fund.role}` : "",
                }),
                new TextRun({
                  text: fund.amount ? `, ${fund.amount}` : "",
                }),
                new TextRun({
                  text: fund.description ? `\n${fund.description}` : "",
                  break: 1,
                }),
              ],
            })
          ),
      ]
      : []

  // Reviewing
  const reviewingBlock =
    (cvData.reviewing?.length || 0) > 0
      ? [
        heading("Reviewing", 2),
        ...cvData.reviewing.map(
          (review) =>
            new Paragraph({
              spacing: { after: 160 },
              text: review.journal || "",
            })
        ),
      ]
      : []

  // Publications (regroupées par catégorie)
  const publicationsBlock =
    (categorizedPublications?.length || 0) > 0
      ? [
        heading("Publications", 2),
        ...categorizedPublications.map((cat) => [
          new Paragraph({
            text: cat.label,
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }),
          ...(cat.publications || []).map(
            (pub) =>
              new Paragraph({
                spacing: { after: 160 },
                children: [
                  new TextRun({
                    text: `${pub.authors || ""} (${pub.year || ""}). `,
                    bold: true,
                  }),
                  new TextRun({
                    text: `${pub.title || ""}. `,
                  }),
                  new TextRun({
                    text: pub.journal ? `${pub.journal}. ` : "",
                    italics: true,
                  }),
                  new TextRun({
                    text: pub.doi ? `DOI: ${pub.doi}` : "",
                  }),
                ],
              })
          ),
        ]).flat(),
      ]
      : []

  // Presentations (similaire à publications, si tu veux)
  const presentationsBlock =
    (categorizedPresentations?.length || 0) > 0
      ? [
        heading("Presentations", 2),
        ...categorizedPresentations.map((cat) => [
          new Paragraph({
            text: cat.label,
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }),
          ...(cat.presentations || []).map(
            (pres) =>
              new Paragraph({
                spacing: { after: 160 },
                children: [
                  new TextRun({
                    text: `${pres.title || ""} (${pres.date || ""})`,
                    bold: true,
                  }),
                  new TextRun({
                    text: pres.location ? `, ${pres.location}` : "",
                  }),
                  new TextRun({
                    text: pres.type ? ` [${pres.type}]` : "",
                  }),
                  new TextRun({
                    text: pres.coAuthors ? `\nco-Authors: ${pres.coAuthors}` : "",
                    break: pres.coAuthors ? 1 : 0,
                  }),
                ],
              })
          ),
        ]).flat(),
      ]
      : []

  // Teaching (similaire à presentations)
  const teachingBlock =
    (categorizedTeachings?.length || 0) > 0
      ? [
        heading("Teaching", 2),
        ...categorizedTeachings.map((cat) => [
          new Paragraph({
            text: cat.label,
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }),
          ...(cat.teachings || []).map(
            (teach) =>
              new Paragraph({
                spacing: { after: 160 },
                children: [
                  new TextRun({
                    text: `${teach.title || ""} (${teach.semester || ""} ${teach.year || ""})`,
                    bold: true,
                  }),
                  new TextRun({
                    text: teach.university ? `, ${teach.university}` : "",
                  }),
                  new TextRun({
                    text: teach.coTeachers ? `\nco-teachers: ${teach.coTeachers}` : "",
                    break: teach.coTeachers ? 1 : 0,
                  }),
                ],
              })
          ),
        ]).flat(),
      ]
      : []

  // Construit le document complet
  const doc = new Document({
    creator: profileData?.name || "Researcher",
    title: "Curriculum Vitae",
    description: "Generated CV",
    sections: [
      {
        properties: {},
        children: [
          ...headerBlock,
          ...positionsBlock,
          ...educationBlock,
          ...fundingBlock,
          ...reviewingBlock,
          ...publicationsBlock,
          ...presentationsBlock,
          ...teachingBlock,
        ].filter(Boolean).flat(),
      },
    ],
  })

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "cv.docx")
  })
}