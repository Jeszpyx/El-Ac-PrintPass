// // "use client";

// // import { Eye, Settings, User as UserIcon, Loader2, Upload, Trash2 } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Label } from "@/components/ui/label";
// // import { open } from '@tauri-apps/plugin-dialog'
// // import { useEffect } from "react";
// // import { usePassStore } from "@/store/pass-store";
// // import { usePrintQueueStore } from "@/store/print-queue-store";
// // import { PassPreviewCard } from "./pass-preview-card";
// // import { PrintCard } from "./print-card";



// // interface PreviewPanelProps {
// // }



// // export function PreviewPanel({ }: PreviewPanelProps) {

// //   const {
// //     backgroundBase64,
// //     isLoading,
// //     loadBackground,
// //     saveBackground,
// //     removeBackground
// //   } = usePassStore();


// //   const {
// //     selectedUser,
// //   } = usePrintQueueStore();

// //   useEffect(() => {
// //     loadBackground();
// //   }, []);

// //   // Функция выбора и сохранения фона
// //   const handleSelectBackground = async () => {
// //     try {
// //       const filePath = await open({
// //         multiple: false,
// //         directory: false,
// //         filters: [{
// //           name: 'Изображения',
// //           extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif']
// //         }]
// //       });

// //       if (filePath && typeof filePath === 'string') {
// //         await saveBackground(filePath);
// //       }
// //     } catch (error) {
// //       console.error('Error selecting background:', error);
// //     }
// //   };

// //   // Функция удаления фона
// //   const handleRemoveBackground = async () => {
// //     await removeBackground();
// //   };




// //   if (isLoading) {
// //     return (
// //       <div className="flex h-[720px] flex-col items-center justify-center">
// //         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
// //         <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex h-[720px] flex-col">
// //       {/* Preview Section - Top 50% */}
// //       <div className="flex flex-1 flex-col border-b border-border">
// //         <div className="border-b border-border p-4">
// //           <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
// //             <Eye className="h-4 w-4" />
// //             Предпросмотр
// //           </h2>
// //         </div>

// //         <div className="flex flex-1 flex-col bg-muted/20 p-4">
// //           {selectedUser ?
// //             <PrintCard user={selectedUser} backgroundImage={backgroundBase64} />
// //             : (
// //               <div className="flex flex-1 flex-col items-center justify-center text-center">
// //                 <UserIcon className="mb-3 h-12 w-12 text-muted-foreground/30" />
// //                 <p className="text-sm text-muted-foreground">Выберите пользователя</p>
// //                 <p className="text-xs text-muted-foreground/70">
// //                   Нажмите на карточку в очереди печати
// //                 </p>
// //               </div>
// //             )}
// //         </div>
// //       </div>

// //       {/* Settings Section - Bottom 50% */}
// //       <div className="flex flex-1 flex-col">
// //         <div className="border-b border-border p-4">
// //           <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
// //             <Settings className="h-4 w-4" />
// //             Настройки
// //           </h2>
// //         </div>
// //         <div className="flex-1 overflow-auto p-4">
// //           <div className="space-y-4">
// //             {/* Background Selection */}
// //             <div className="space-y-3">
// //               <Label className="text-sm font-medium">
// //                 Фон для пропуска
// //               </Label>

// //               {/* Preview of selected background */}
// //               {backgroundBase64 && (
// //                 <div className="relative rounded-lg overflow-hidden border border-border">
// //                   <img
// //                     src={backgroundBase64}
// //                     alt="Background preview"
// //                     className="w-full h-32 object-cover"
// //                   />
// //                   <Button
// //                     variant="destructive"
// //                     size="sm"
// //                     className="absolute top-2 right-2"
// //                     onClick={handleRemoveBackground}
// //                   >
// //                     <Trash2 className="h-3 w-3 mr-1" />
// //                     Удалить
// //                   </Button>
// //                 </div>
// //               )}

// //               {/* Button for background selection */}
// //               <Button
// //                 onClick={handleSelectBackground}
// //                 variant="default"
// //                 className="w-full"
// //               >
// //                 <Upload className="mr-2 h-4 w-4" />
// //                 {backgroundBase64 ? 'Изменить фон' : 'Выбрать фон'}
// //               </Button>

// //               {/* Info text */}
// //               <p className="text-xs text-muted-foreground">
// //                 Поддерживаемые форматы: PNG, JPG, JPEG, WEBP, BMP, GIF
// //               </p>

// //               {/* Show info if background is set */}
// //               {backgroundBase64 && (
// //                 <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-2 rounded">
// //                   ✓ Фон установлен
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { Eye, Settings, User as UserIcon, Loader2, Upload, Trash2, Folder, Database, Image } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { open } from '@tauri-apps/plugin-dialog'
// import { useEffect, useState } from "react";
// import { usePassStore } from "@/store/pass-store";
// import { usePrintQueueStore } from "@/store/print-queue-store";
// import { PrintCard } from "./print-card";
// import { Input } from "./ui/input";
// import { StoreService } from "@/store/app-store";

// interface PreviewPanelProps {
// }

// export function PreviewPanel({ }: PreviewPanelProps) {
//   const {
//     backgroundBase64,
//     isLoading,
//     loadBackground,
//     saveBackground,
//   } = usePassStore();

//   const {
//     selectedUser,
//   } = usePrintQueueStore();

//   const [dbHost, setDbHost] = useState<string>('localhost');
//   const [dbPath, setDbPath] = useState<string>('');
//   const [isSettingsLoading, setIsSettingsLoading] = useState(true);


//   useEffect(() => {
//     const loadSettings = async () => {
//       try {
//         await loadBackground();

//         // Загружаем настройки БД
//         const [host, path] = await Promise.all([
//           StoreService.getDbHost(),
//           StoreService.getDbPath()
//         ]);

//         setDbHost(host);
//         setDbPath(path);
//       } catch (error) {
//         console.error('Failed to load settings:', error);
//       } finally {
//         setIsSettingsLoading(false);
//       }
//     };

//     loadSettings();
//   }, [loadBackground]);


//   // Обработчики для настроек БД
//   const handleDbHostChange = async (value: string) => {
//     setDbHost(value);
//     await StoreService.setDbHost(value);
//   };

//   const handleDbPathChange = async (value: string) => {
//     setDbPath(value);
//     await StoreService.setDbPath(value);
//   };



//   // Функция выбора и сохранения фона
//   const handleSelectBackground = async () => {
//     try {
//       const filePath = await open({
//         multiple: false,
//         directory: false,
//         filters: [{
//           name: 'Изображения',
//           extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif']
//         }]
//       });

//       if (filePath && typeof filePath === 'string') {
//         await saveBackground(filePath);
//       }
//     } catch (error) {
//       console.error('Error selecting background:', error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-[720px] flex-col items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//         <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-[720px] flex-col">
//       {/* Preview Section - Top 50% */}
//       <div className="flex flex-1 flex-col border-b border-border">
//         <div className="border-b border-border p-4">
//           <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
//             <Eye className="h-4 w-4" />
//             Предпросмотр
//           </h2>
//         </div>

//         <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 p-4">
//           {selectedUser ? (
//             <div className="flex flex-col items-center gap-4">
//               {/* Карточка фиксированного размера 68x48mm */}
//               <div
//                 style={{
//                   width: "68mm",
//                   height: "48mm",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                   borderRadius: "4px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <PrintCard
//                   user={selectedUser}
//                   backgroundImage={backgroundBase64}
//                 />
//               </div>

//               {/* Подпись о размере */}
//               <p className="text-xs text-muted-foreground text-center">
//                 68×48 мм (размер пропуска)
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-1 flex-col items-center justify-center text-center">
//               <UserIcon className="mb-3 h-12 w-12 text-muted-foreground/30" />
//               <p className="text-sm text-muted-foreground">Выберите пользователя</p>
//               <p className="text-xs text-muted-foreground/70">
//                 Нажмите на карточку в очереди печати
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Settings Section - Bottom 50% */}
//       <div className="flex flex-1 flex-col">
//         <div className="border-b border-border p-4">
//           <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
//             <Settings className="h-4 w-4" />
//             Настройки
//           </h2>
//         </div>
//         <div className="flex-1 overflow-auto p-4">
//           <div className="space-y-4">
//             <h3 className="text-sm font-medium flex items-center gap-2">
//               <Database className="h-4 w-4" />
//               База данных
//             </h3>

//             {/* DB Host Input */}
//             <div className="space-y-2">
//               <Label htmlFor="db-host" className="text-sm">
//                 Хост базы данных
//               </Label>
//               <Input
//                 id="db-host"
//                 type="text"
//                 placeholder="localhost"
//                 value={dbHost}
//                 onChange={(e) => handleDbHostChange(e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             {/* DB Path Input */}
//             <div className="space-y-2">
//               <Label htmlFor="db-path" className="text-sm">
//                 Путь к файлу базы данных
//               </Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="db-path"
//                   type="text"
//                   placeholder="C:\Electra\El-Ac\Global.fdb"
//                   value={dbPath}
//                   onChange={(e) => handleDbPathChange(e.target.value)}
//                   className="flex-1"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-b border-border p-4"></div>

//           <div className="space-y-4">
//             <h3 className="text-sm font-medium flex items-center gap-2">
//               <Image className="h-4 w-4" />
//               Фон для пропуска
//             </h3>


//             <Button
//               onClick={handleSelectBackground}
//               variant="default"
//               className="w-full"
//             >
//               <Upload className="mr-2 h-4 w-4" />
//               {backgroundBase64 ? 'Изменить фон' : 'Выбрать фон'}
//             </Button>

//             {/* Info text */}
//             <p className="text-xs text-muted-foreground">
//               Поддерживаемые форматы: PNG, JPG, JPEG, WEBP, BMP, GIF
//             </p>

//             {/* Show info if background is set */}
//             {backgroundBase64 && (
//               <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-2 rounded">
//                 ✓ Фон установлен
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Eye, Settings, User as UserIcon, Loader2, Upload, Trash2, Folder, Database, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { open } from '@tauri-apps/plugin-dialog'
import { usePassStore } from "@/store/pass-store";
import { usePrintQueueStore } from "@/store/print-queue-store";
import { PrintCard } from "./print-card";
import { Input } from "./ui/input";
import { StoreService } from "@/store/app-store";
import { Switch } from "./ui/switch";
import { useSettingsStore } from "@/store/settings-store";

interface PreviewPanelProps {
}

export function PreviewPanel({ }: PreviewPanelProps) {
  const {
    backgroundBase64,
    isLoading,
    loadBackground,
    saveBackground,
  } = usePassStore();

  const {
    selectedUser,
  } = usePrintQueueStore();

  const {
    dbHost,
    dbPath,
    paperFormat,
    setDbHost,
    setDbPath,
    setPaperFormat,
    getCardsPerSheet,
  } = useSettingsStore();


  // Обработчики для настроек БД
  const handleDbHostChange = async (value: string) => {
    setDbHost(value);
    // await StoreService.setDbHost(value);
  };

  const handleDbPathChange = async (value: string) => {
    setDbPath(value);
    // await StoreService.setDbPath(value);
  };

  // Обработчик для формата бумаги
  const handlePaperFormatChange = async (checked: boolean) => {
    const newFormat = checked ? 'A5' : 'A4';
    setPaperFormat(newFormat);
    // await StoreService.setPaperFormat(newFormat);
  };

  // Функция выбора и сохранения фона
  const handleSelectBackground = async () => {
    try {
      const filePath = await open({
        multiple: false,
        directory: false,
        filters: [{
          name: 'Изображения',
          extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif']
        }]
      });

      if (filePath && typeof filePath === 'string') {
        await saveBackground(filePath);
      }
    } catch (error) {
      console.error('Error selecting background:', error);
    }
  };

  // // Расчет количества карточек на листе в зависимости от формата
  // const getCardsPerSheet = () => {
  //   return paperFormat === 'A4' ? 15 : 6; // A4: 3x5=15, A5: 2x3=6
  // };

  if (isLoading) {
    return (
      <div className="flex h-[720px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[720px] flex-col">
      {/* Preview Section - Top 50% */}
      <div className="flex flex-1 flex-col border-b border-border">
        <div className="border-b border-border p-4">
          <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Eye className="h-4 w-4" />
            Предпросмотр
          </h2>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 p-4">
          {selectedUser ? (
            <div className="flex flex-col items-center gap-4">
              {/* Карточка фиксированного размера 68x48mm */}
              <div
                style={{
                  width: "68mm",
                  height: "48mm",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <PrintCard
                  user={selectedUser}
                  backgroundImage={backgroundBase64}
                />
              </div>

              {/* Подпись о размере и формате */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  68×48 мм (размер пропуска)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Формат бумаги: {paperFormat} • Карточек на листе: {getCardsPerSheet()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <UserIcon className="mb-3 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Выберите пользователя</p>
              <p className="text-xs text-muted-foreground/70">
                Нажмите на карточку в очереди печати
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Section - Bottom 50% */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-border p-4">
          <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Settings className="h-4 w-4" />
            Настройки
          </h2>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {/* Формат бумаги */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Формат бумаги
            </h3>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <Label className="text-sm font-medium">A4</Label>
                <p className="text-xs text-muted-foreground">15 карточек (3×5)</p>
              </div>
              <Switch
                checked={paperFormat === 'A5'}
                onCheckedChange={handlePaperFormatChange}
              />
              <div className="text-right">
                <Label className="text-sm font-medium">A5</Label>
                <p className="text-xs text-muted-foreground">6 карточек (2×3)</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-border my-4"></div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              База данных
            </h3>

            {/* DB Host Input */}
            <div className="space-y-2">
              <Label htmlFor="db-host" className="text-sm">
                Хост базы данных
              </Label>
              <Input
                id="db-host"
                type="text"
                placeholder="localhost"
                value={dbHost}
                onChange={(e) => handleDbHostChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* DB Path Input */}
            <div className="space-y-2">
              <Label htmlFor="db-path" className="text-sm">
                Путь к файлу базы данных
              </Label>
              <div className="flex gap-2">
                <Input
                  id="db-path"
                  type="text"
                  placeholder="C:\Electra\El-Ac\Global.fdb"
                  value={dbPath}
                  onChange={(e) => handleDbPathChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-border my-4"></div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Фон для пропуска
            </h3>

            <Button
              onClick={handleSelectBackground}
              variant="default"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {backgroundBase64 ? 'Изменить фон' : 'Выбрать фон'}
            </Button>

            {/* Info text */}
            <p className="text-xs text-muted-foreground">
              Поддерживаемые форматы: PNG, JPG, JPEG, WEBP, BMP, GIF
            </p>

            {/* Show info if background is set */}
            {backgroundBase64 && (
              <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-2 rounded">
                ✓ Фон установлен
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}