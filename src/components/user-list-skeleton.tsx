'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ChevronRight } from "lucide-react";

export function UserListSkeleton() {
    return (
        <div className="flex h-full flex-col border-r border-border">
            <div className="border-b border-border p-4">
                <div className="mb-3 h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 bg-muted animate-pulse rounded"></div>
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {/* Скелетон группы 1 */}
                    <UserGroupSkeleton />
                    {/* Скелетон группы 2 */}
                    <UserGroupSkeleton />
                    {/* Скелетон группы 3 */}
                    <UserGroupSkeleton />
                </div>
            </ScrollArea>
        </div>
    );
}

function UserGroupSkeleton() {
    return (
        <div className="mb-2 animate-pulse">
            {/* Заголовок группы */}
            <div className="flex items-center gap-1 rounded-md bg-secondary/50 p-2">
                <div className="flex flex-1 items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-8 bg-muted rounded"></div>
                </div>
                <div className="h-7 w-14 bg-muted rounded"></div>
            </div>

            {/* Пользователи группы (3 скелетона) */}
            <div className="mt-1 space-y-1 pl-4">
                <UserSkeletonItem />
                <UserSkeletonItem />
                <UserSkeletonItem />
            </div>
        </div>
    );
}

function UserSkeletonItem() {
    return (
        <div className="flex items-center gap-3 rounded-md p-2">
            {/* Аватар */}
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>

            {/* Имя пользователя */}
            <div className="flex-1">
                <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            </div>

            {/* Кнопка добавления */}
            <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
        </div>
    );
}