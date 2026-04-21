// "use client";

// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Trash2, Printer } from "lucide-react";
// import { useRef } from "react";
// import { useReactToPrint } from 'react-to-print';
// import { PrintCard } from './print-card';
// import { usePrintQueueStore } from "@/store/print-queue-store";
// import { usePassStore } from "@/store/pass-store";
// import { User } from "@/types/user";

// interface PrintQueueProps {
// }

// export function PrintQueue({ }: PrintQueueProps) {
//   const {
//     printQueue,
//     selectedUser,
//     removeUser,
//     clearAll,
//     selectUser
//   } = usePrintQueueStore();

//   const { backgroundBase64 } = usePassStore()

//   const printRef = useRef<HTMLDivElement>(null);

//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     pageStyle: `
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }
//         @page {
//             size: A4;
//             margin: 3mm;
//         }
//         @media print {
//             html, body {
//                 margin: 0 !important;
//                 padding: 0 !important;
//                 width: 100%;
//                 height: 100%;
//             }
//             .print-container {
//                 page-break-after: always;
//                 margin: 0;
//                 padding: 0;
//             }
//             .print-container:last-child {
//                 page-break-after: auto;
//             }
//             div {
//                 -webkit-print-color-adjust: exact;
//                 print-color-adjust: exact;
//             }
//         }
//     `,
//   });

//   // Функция для группировки карточек по листам (по 15 карточек на лист)
//   const getPrintSheets = () => {
//     const sheets: User[][] = [];
//     for (let i = 0; i < printQueue.length; i += 15) {
//       sheets.push(printQueue.slice(i, i + 15));
//     }
//     return sheets;
//   };

//   return (
//     <div className="flex h-full flex-col border-r border-border">
//       <div className="flex items-center justify-between border-b border-border p-4">
//         <div>
//           <h2 className="text-sm font-medium text-foreground">Очередь печати</h2>
//           <p className="text-xs text-muted-foreground">
//             {printQueue.length} {printQueue.length === 1 ? "пользователь" : "пользователей"}
//           </p>
//           <p className="text-xs text-muted-foreground">
//             Листов для печати: {Math.ceil(printQueue.length / 15)}
//           </p>
//         </div>
//         {printQueue.length > 0 && (
//           <div className="flex gap-3">
//             <Button
//               size="sm"
//               className="h-8 text-xs ml-8 bg-green-600 hover:bg-green-700 text-white"
//               onClick={handlePrint}
//             >
//               <Printer className="mr-1 h-3 w-3" />
//               Печать
//             </Button>
//             <Button
//               size="sm"
//               variant="destructive"
//               className="h-8 text-xs"
//               onClick={clearAll}
//             >
//               <Trash2 className="mr-1 h-3 w-3" />
//               Удалить всех
//             </Button>
//           </div>
//         )}
//       </div>

//       <ScrollArea className="flex-1">
//         {printQueue.length > 0 ? (
//           <div className="grid grid-cols-2 gap-3 p-4">
//             {printQueue.map((user) => {
//               const isSelected = selectedUser?.num === user.num;
//               return (
//                 <div
//                   key={user.num}
//                   onClick={() => selectUser(user)}
//                   className={`group relative cursor-pointer rounded-lg border p-3 transition-colors ${isSelected
//                     ? "border-primary bg-primary/10"
//                     : "border-border bg-card hover:border-muted-foreground/30"
//                     }`}
//                 >
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeUser(user);
//                     }}
//                     className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-destructive/20 group-hover:opacity-100"
//                   >
//                     <Trash2 className="h-4 w-4 text-destructive" />
//                   </button>
//                   <div className="flex flex-col items-center text-center">
//                     <div className="mb-2 h-16 w-16 overflow-hidden rounded-full bg-muted">
//                       {user.photo ? (
//                         <img
//                           src={`data:image/jpeg;base64,${user.photo}`}
//                           alt={user.username}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
//                           {user.username.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </div>
//                     <p className="line-clamp-2 text-sm font-medium text-foreground">
//                       {user.username}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="flex h-full flex-col items-center justify-center p-8 text-center">
//             <Printer className="mb-3 h-12 w-12 text-muted-foreground/30" />
//             <p className="text-sm text-muted-foreground">Очередь пуста</p>
//             <p className="text-xs text-muted-foreground/70">
//               Добавьте пользователей из списка слева
//             </p>
//           </div>
//         )}
//       </ScrollArea>

//       {/* 👇 СКРЫТЫЙ БЛОК ДЛЯ ПЕЧАТИ */}
//       <div style={{ display: 'none' }}>
//         <div ref={printRef}>
//           {getPrintSheets().map((sheetUsers, sheetIndex) => (
//             <div
//               key={`sheet-${sheetIndex}`}
//               style={{
//                 width: "204mm",
//                 height: "291mm",
//                 pageBreakAfter: "always",
//                 margin: 0,
//                 padding: 0,
//                 boxSizing: "border-box",
//               }}
//             >
//               {/* Сетка для 15 карточек: 3x5 */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, 68mm)",
//                   gridTemplateRows: "repeat(5, 48mm)",
//                   gap: 0,
//                   width: "204mm",
//                   height: "240mm",
//                   margin: 0,
//                   padding: 0,
//                   boxSizing: "border-box",
//                 }}
//               >
//                 {Array.from({ length: 15 }).map((_, index) => {
//                   const user = sheetUsers[index];
//                   if (!user) {
//                     return (
//                       <div
//                         key={`empty-${index}`}
//                         style={{
//                           width: "68mm",
//                           height: "48mm",
//                           boxSizing: "border-box",
//                         }}
//                       />
//                     );
//                   }
//                   return (
//                     <PrintCard
//                       key={user.num}
//                       user={user}
//                       backgroundImage={backgroundBase64}
//                     />
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Printer } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from 'react-to-print';
import { PrintCard } from './print-card';
import { usePrintQueueStore } from "@/store/print-queue-store";
import { usePassStore } from "@/store/pass-store";
import { User } from "@/types/user";
import { StoreService } from "@/store/app-store";
import { useSettingsStore } from "@/store/settings-store";

interface PrintQueueProps {
}

export function PrintQueue({ }: PrintQueueProps) {
  const {
    printQueue,
    selectedUser,
    removeUser,
    clearAll,
    selectUser
  } = usePrintQueueStore();

  const {
    paperFormat,
  } = useSettingsStore();

  const { backgroundBase64 } = usePassStore();

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => { }, [paperFormat])


  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        @page {
            size: ${paperFormat};
            margin: 3mm;
        }
        @media print {
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100%;
                height: 100%;
            }
            .print-container {
                page-break-after: always;
                margin: 0;
                padding: 0;
            }
            .print-container:last-child {
                page-break-after: auto;
            }
            div {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    `,
  });

  // Функция для группировки карточек по листам в зависимости от формата
  const getPrintSheets = () => {
    const sheets: User[][] = [];
    const cardsPerSheet = paperFormat === 'A4' ? 15 : 6;

    for (let i = 0; i < printQueue.length; i += cardsPerSheet) {
      sheets.push(printQueue.slice(i, i + cardsPerSheet));
    }
    return sheets;
  };

  // Получение конфигурации для текущего формата
  const getSheetConfig = () => {
    if (paperFormat === 'A4') {
      return {
        columns: 3,
        rows: 5,
        sheetWidth: "204mm", // 3 * 68mm
        sheetHeight: "240mm", // 5 * 48mm
        pageWidth: "210mm",
        pageHeight: "297mm",
        cardsPerSheet: 15
      };
    } else { // A5
      return {
        columns: 2,
        rows: 3,
        sheetWidth: "136mm", // 2 * 68mm
        sheetHeight: "144mm", // 3 * 48mm
        pageWidth: "148mm",
        pageHeight: "210mm",
        cardsPerSheet: 6
      };
    }
  };

  const config = getSheetConfig();

  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Очередь печати</h2>
          <p className="text-xs text-muted-foreground">
            {printQueue.length} {printQueue.length === 1 ? "пользователь" : "пользователей"}
          </p>
          <p className="text-xs text-muted-foreground">
            Формат: {paperFormat} • Листов: {Math.ceil(printQueue.length / config.cardsPerSheet)}
          </p>
        </div>
        {printQueue.length > 0 && (
          <div className="flex gap-3">
            <Button
              size="sm"
              className="h-8 text-xs ml-8 bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePrint}
            >
              <Printer className="mr-1 h-3 w-3" />
              Печать
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 text-xs"
              onClick={clearAll}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Удалить всех
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {printQueue.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {printQueue.map((user) => {
              const isSelected = selectedUser?.num === user.num;
              return (
                <div
                  key={user.num}
                  onClick={() => selectUser(user)}
                  className={`group relative cursor-pointer rounded-lg border p-3 transition-colors ${isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUser(user);
                    }}
                    className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-destructive/20 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 h-16 w-16 overflow-hidden rounded-full bg-muted">
                      {user.photo ? (
                        <img
                          src={`data:image/jpeg;base64,${user.photo}`}
                          alt={user.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm font-medium text-foreground">
                      {user.username}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <Printer className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Очередь пуста</p>
            <p className="text-xs text-muted-foreground/70">
              Добавьте пользователей из списка слева
            </p>
          </div>
        )}
      </ScrollArea>

      {/* 👇 СКРЫТЫЙ БЛОК ДЛЯ ПЕЧАТИ */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          {getPrintSheets().map((sheetUsers, sheetIndex) => (
            <div
              key={`sheet-${sheetIndex}`}
              style={{
                width: config.pageWidth,
                height: config.pageHeight,
                pageBreakAfter: "always",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
              }}
            >
              {/* Сетка для карточек в зависимости от формата */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${config.columns}, 68mm)`,
                  gridTemplateRows: `repeat(${config.rows}, 48mm)`,
                  gap: 0,
                  width: config.sheetWidth,
                  height: config.sheetHeight,
                  margin: 0,
                  padding: 0,
                  boxSizing: "border-box",
                }}
              >
                {Array.from({ length: config.cardsPerSheet }).map((_, index) => {
                  const user = sheetUsers[index];
                  if (!user) {
                    return (
                      <div
                        key={`empty-${index}`}
                        style={{
                          width: "68mm",
                          height: "48mm",
                          boxSizing: "border-box",
                        }}
                      />
                    );
                  }
                  return (
                    <PrintCard
                      key={user.num}
                      user={user}
                      backgroundImage={backgroundBase64}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}