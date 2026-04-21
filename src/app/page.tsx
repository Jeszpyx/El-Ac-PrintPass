"use client";

import { UserList } from "@/components/user-list";
import { PrintQueue } from "@/components/print-queue";
import { PreviewPanel } from "@/components/preview-panel";
import { useEffect, useState } from "react";
import { useActivationStore } from "@/store/activation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function PassPrinterApp() {

  const { activated, isLoading, activate } = useActivationStore()
  const [activationCode, setActivationCode] = useState<string>("")
  const [error, setError] = useState<string>("")

  const checkDate = new Date()
  const targetDate = new Date(2026, 6, 1)
  const isAfterTargetDate = checkDate >= targetDate

  // Показываем загрузку, пока данные не восстановлены из localStorage
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (isAfterTargetDate && !activated) {
    const handleActivate = async () => {
      const actRes: boolean = await activate(activationCode)
      if (!actRes) {
        setError("Неверный код активации")
      } else {
        setError("")
      }
    }

    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <svg
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Приложение не активировано
            </h2>
            <p className="text-sm text-muted-foreground">
              Срок действия лицензии истёк 1 июня 2026 года.
              Пожалуйста, введите код активации для продолжения работы.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Введите код активации"
                value={activationCode}
                onChange={(e) => {
                  setActivationCode(e.target.value)
                  setError("")
                }}
                className="text-center"
              />
              {error && (
                <p className="mt-2 text-xs text-destructive">{error}</p>
              )}
            </div>

            <Button onClick={handleActivate} className="w-full">
              Активировать
            </Button>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="grid h-screen grid-cols-3 bg-background">
      {/* Left Panel - User List */}
      <div className="min-w-0">
        <UserList />
      </div>

      {/* Center Panel - Print Queue */}
      <div className="min-w-0">
        <PrintQueue />
      </div>

      {/* Right Panel - Preview & Settings */}
      <div className="min-w-0 border-l border-border">
        <PreviewPanel />
      </div>
    </div>
  );
}
