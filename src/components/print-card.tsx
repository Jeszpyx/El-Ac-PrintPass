// "use client";

// import { User } from "@/types/user";
// import { useEffect, useState } from "react";

// interface PrintCardProps {
//     user: User;
//     backgroundImage: string | null;
// }

// export function PrintCard({ user, backgroundImage }: PrintCardProps) {
//     const [fioLines, setFioLines] = useState<string[]>([]);
//     const [optimalFioSize, setOptimalFioSize] = useState<number>(8);
//     const [optimalPositionSize, setOptimalPositionSize] = useState<number>(7);

//     // Разбиваем ФИО по пробелам строго на 3 слова и 3 строки:
//     // 1-е слово, 2-е слово, 3-е слово. Лишние слова игнорируются.
//     // Если слов меньше, недостающие строки остаются пустыми.
//     const splitFioIntoThreeParts = (text: string): string[] => {
//         if (!text) return ["", "", ""];
//         const normalized = text.replace(/\s+/g, " ").trim();
//         const words = normalized ? normalized.split(" ") : [];
//         const line1 = words[0] ?? "";
//         const line2 = words[1] ?? "";
//         const line3 = words[2] ?? "";
//         return [line1, line2, line3];
//     };

//     // Функция для подсчета количества строк
//     const countLines = (text: string, charsPerLine: number): number => {
//         if (!text) return 0;
//         const parts = text.split(' ');
//         let lines = 1;
//         let currentLength = 0;

//         for (const part of parts) {
//             const wordLength = part.length;
//             if (currentLength + wordLength + (currentLength > 0 ? 1 : 0) <= charsPerLine) {
//                 currentLength += wordLength + (currentLength > 0 ? 1 : 0);
//             } else {
//                 lines++;
//                 currentLength = wordLength;
//             }
//         }
//         return lines;
//     };

//     // Функция для автоматического подбора размера шрифта
//     const getOptimalFontSize = (
//         text: string,
//         baseSize: number,
//         minSize: number,
//         maxLines: number,
//         charsPerLineAtBase: number
//     ): number => {
//         if (!text) return baseSize;

//         const linesAtBase = countLines(text, charsPerLineAtBase);

//         if (linesAtBase <= maxLines) {
//             return baseSize;
//         }

//         const linesNeeded = Math.ceil(text.length / (charsPerLineAtBase * 0.7));
//         let newSize = baseSize;

//         if (linesNeeded > maxLines) {
//             newSize = Math.max(minSize, baseSize * (maxLines / linesNeeded));
//         }

//         return Math.round(newSize * 10) / 10;
//     };

//     useEffect(() => {
//         // Рассчитываем оптимальные размеры шрифта
//         const fioSize = getOptimalFontSize(
//             user.username,
//             8, 5, 3, 18
//         );
//         const positionSize = getOptimalFontSize(
//             user.job_title || "",
//             7, 5, 2, 20
//         );

//         setOptimalFioSize(fioSize);
//         setOptimalPositionSize(positionSize);

//         // Разбиваем ФИО строго по пробелам на 3 части максимум
//         const lines = splitFioIntoThreeParts(user.username);
//         setFioLines(lines);
//     }, [user.username, user.job_title]);

//     // Стиль для фона - используем backgroundImage как в HTML
//     const cardStyle: React.CSSProperties = {
//         width: "68mm",
//         height: "48mm",
//         position: "relative",
//         fontFamily: '"Times New Roman", Times, serif',
//         boxSizing: "border-box",
//         printColorAdjust: "exact",
//         WebkitPrintColorAdjust: "exact",
//         breakInside: "avoid",
//         pageBreakInside: "avoid",
//     };

//     // Добавляем фоновое изображение если оно есть
//     if (backgroundImage) {
//         cardStyle.backgroundImage = `url(${backgroundImage})`;
//         cardStyle.backgroundSize = "100% 100%";
//         cardStyle.backgroundPosition = "center";
//         cardStyle.backgroundRepeat = "no-repeat";
//     }

//     return (
//         <div style={cardStyle}>
//             {/* Grid контейнер */}
//             <div
//                 style={{
//                     padding: "1mm",
//                     width: "100%",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     boxSizing: "border-box",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(2, 1fr)",
//                         gridTemplateRows: "repeat(4, 1fr)",
//                         gap: "0.5mm",
//                         width: "100%",
//                         height: "100%",
//                         boxSizing: "border-box",
//                     }}
//                 >
//                     {/* Ячейка 1 - прозрачная */}
//                     <div
//                         style={{
//                             background: "transparent",
//                             borderRadius: "0.5mm",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "6pt",
//                             padding: "0.5mm",
//                         }}
//                     />

//                     {/* Ячейка 2 - прозрачная */}
//                     <div
//                         style={{
//                             background: "transparent",
//                             borderRadius: "0.5mm",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "6pt",
//                             padding: "0.5mm",
//                         }}
//                     />

//                     {/* Ячейка 3 - ФИО */}
//                     <div
//                         style={{
//                             marginLeft: "2mm",
//                             marginRight: "2mm",
//                             // background: "rgba(255,255,255,0.8)",
//                             background: "transparent",
//                             borderRadius: "0.5mm",
//                             display: "flex",
//                             flexDirection: "column",
//                             justifyContent: "center",
//                             alignItems: "flex-start",
//                             textAlign: "left",
//                             padding: "1mm",
//                             color: "black",
//                             fontWeight: "bold",
//                             fontSize: `${optimalFioSize}pt`,
//                             boxSizing: "border-box",
//                             overflow: "hidden",
//                         }}
//                     >
//                         {fioLines.map((line, idx) => (
//                             <div
//                                 key={idx}
//                                 style={{
//                                     width: "100%",
//                                     lineHeight: 1.3,
//                                     wordWrap: "break-word",
//                                     whiteSpace: "normal",
//                                     textAlign: "left",
//                                 }}
//                             >
//                                 {line}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Ячейка 4 - прозрачная */}
//                     <div
//                         style={{
//                             background: "transparent",
//                             borderRadius: "0.5mm",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "6pt",
//                             padding: "0.5mm",
//                         }}
//                     />

//                     {/* Ячейка 5 - прозрачная */}
//                     <div
//                         style={{
//                             background: "transparent",
//                             borderRadius: "0.5mm",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "6pt",
//                             padding: "0.5mm",
//                         }}
//                     />

//                     {/* Ячейки 6+7 (ряд 3–4, кол. 2): одна объединённая — должность сверху слева, отдел с новой строки с красной строкой */}
//                     <div
//                         style={{
//                             background: "transparent",
//                             borderRadius: "0.5mm",
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "flex-start",
//                             justifyContent: "flex-start",
//                             textAlign: "left",
//                             padding: "1mm",
//                             color: "black",
//                             fontWeight: "bold",
//                             fontSize: `${optimalPositionSize}pt`,
//                             wordWrap: "break-word",
//                             whiteSpace: "normal",
//                             boxSizing: "border-box",
//                             gridColumn: "2 / 3",
//                             gridRow: "3 / 5",
//                         }}
//                     >
//                         <div style={{ width: "100%", textAlign: "left" }}>
//                             {user.job_title || ""}
//                         </div>
//                         {(user.department || "").trim() ? (
//                             <div
//                                 style={{
//                                     width: "100%",
//                                     textAlign: "left",
//                                     marginTop: user.job_title?.trim()
//                                         ? "0.8mm"
//                                         : 0,
//                                     textIndent: "2.5mm",
//                                 }}
//                             >
//                                 {user.department}
//                             </div>
//                         ) : null}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { User } from "@/types/user";
import { useEffect, useState } from "react";

interface PrintCardProps {
    user: User;
    backgroundImage: string | null;
}

export function PrintCard({ user, backgroundImage }: PrintCardProps) {
    const [fioLines, setFioLines] = useState<string[]>([]);
    const [optimalFioSize, setOptimalFioSize] = useState<number>(8);
    const [optimalPositionSize, setOptimalPositionSize] = useState<number>(7);

    // Разбиваем ФИО по пробелам строго на 3 слова и 3 строки:
    // 1-е слово, 2-е слово, 3-е слово. Лишние слова игнорируются.
    // Если слов меньше, недостающие строки остаются пустыми.
    const splitFioIntoThreeParts = (text: string): string[] => {
        if (!text) return ["", "", ""];
        const normalized = text.replace(/\s+/g, " ").trim();
        const words = normalized ? normalized.split(" ") : [];
        const line1 = words[0] ?? "";
        const line2 = words[1] ?? "";
        const line3 = words[2] ?? "";
        return [line1, line2, line3];
    };

    // Функция для подсчета количества строк
    const countLines = (text: string, charsPerLine: number): number => {
        if (!text) return 0;
        const parts = text.split(' ');
        let lines = 1;
        let currentLength = 0;

        for (const part of parts) {
            const wordLength = part.length;
            if (currentLength + wordLength + (currentLength > 0 ? 1 : 0) <= charsPerLine) {
                currentLength += wordLength + (currentLength > 0 ? 1 : 0);
            } else {
                lines++;
                currentLength = wordLength;
            }
        }
        return lines;
    };

    // Функция для автоматического подбора размера шрифта
    const getOptimalFontSize = (
        text: string,
        baseSize: number,
        minSize: number,
        maxLines: number,
        charsPerLineAtBase: number
    ): number => {
        if (!text) return baseSize;

        const linesAtBase = countLines(text, charsPerLineAtBase);

        if (linesAtBase <= maxLines) {
            return baseSize;
        }

        const linesNeeded = Math.ceil(text.length / (charsPerLineAtBase * 0.7));
        let newSize = baseSize;

        if (linesNeeded > maxLines) {
            newSize = Math.max(minSize, baseSize * (maxLines / linesNeeded));
        }

        return Math.round(newSize * 10) / 10;
    };

    useEffect(() => {
        // Рассчитываем оптимальные размеры шрифта
        const fioSize = getOptimalFontSize(
            user.username,
            8, 5, 3, 18
        );
        const positionSize = getOptimalFontSize(
            user.job_title || "",
            7, 5, 2, 20
        );

        setOptimalFioSize(fioSize);
        setOptimalPositionSize(positionSize);

        // Разбиваем ФИО строго по пробелам на 3 части максимум
        const lines = splitFioIntoThreeParts(user.username);
        setFioLines(lines);
    }, [user.username, user.job_title]);

    // Стиль для фона - используем backgroundImage как в HTML
    const cardStyle: React.CSSProperties = {
        width: "68mm",
        height: "48mm",
        position: "relative",
        fontFamily: '"Times New Roman", Times, serif',
        boxSizing: "border-box",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
        breakInside: "avoid",
        pageBreakInside: "avoid",
    };

    // Добавляем фоновое изображение если оно есть
    if (backgroundImage) {
        cardStyle.backgroundImage = `url(${backgroundImage})`;
        cardStyle.backgroundSize = "100% 100%";
        cardStyle.backgroundPosition = "center";
        cardStyle.backgroundRepeat = "no-repeat";
    }

    return (
        <div style={cardStyle}>
            {/* Grid контейнер */}
            <div
                style={{
                    padding: "1mm",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gridTemplateRows: "repeat(4, 1fr)",
                        gap: "0.5mm",
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Ячейка 1 - прозрачная */}
                    <div
                        style={{
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "6pt",
                            padding: "0.5mm",
                        }}
                    />

                    {/* Ячейка 2 - прозрачная */}
                    <div
                        style={{
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "6pt",
                            padding: "0.5mm",
                        }}
                    />

                    {/* Ячейка 3 - ФИО */}
                    <div
                        style={{
                            marginLeft: "2mm",
                            marginRight: "2mm",
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            textAlign: "left",
                            padding: "1mm",
                            color: "black",
                            fontWeight: "bold",
                            fontSize: `${optimalFioSize}pt`,
                            boxSizing: "border-box",
                            overflow: "hidden",
                        }}
                    >
                        {fioLines.map((line, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: "100%",
                                    lineHeight: 1.3,
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                    textAlign: "left",
                                }}
                            >
                                {line}
                            </div>
                        ))}
                    </div>

                    {/* Ячейки 4+6 (объединённые) - Должность и отдел */}
                    <div
                        style={{
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            textAlign: "left",
                            padding: "0mm",
                            color: "black",
                            fontWeight: "bold",
                            fontSize: `${optimalPositionSize}pt`,
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            boxSizing: "border-box",
                            gridColumn: "2 / 3",
                            gridRow: "2 / 4",
                            overflow: "hidden",
                        }}
                    >
                        {user.job_title && (
                            <p style={{
                                margin: 0,
                                padding: 0,
                                width: "100%",
                                textAlign: "left",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                            }}>
                                {user.job_title}
                            </p>
                        )}
                        {user.department && (
                            <p style={{
                                margin: 0,
                                // marginTop: user.job_title ? "1mm" : 0,
                                padding: 0,
                                width: "100%",
                                textAlign: "left",
                                // textIndent: "2.5mm",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                            }}>
                                {user.department}
                            </p>
                        )}
                    </div>

                    {/* Ячейка 5 - прозрачная */}
                    <div
                        style={{
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "6pt",
                            padding: "0.5mm",
                        }}
                    />

                    {/* Ячейка 7 - прозрачная */}
                    <div
                        style={{
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "6pt",
                            padding: "0.5mm",
                        }}
                    />

                    {/* Ячейка 8 - прозрачная */}
                    <div
                        style={{
                            background: "transparent",
                            borderRadius: "0.5mm",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "6pt",
                            padding: "0.5mm",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}