// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Search, Plus, Users, ChevronDown, ChevronRight } from "lucide-react";
// import type { User, UsersResponse } from "@/types/user";
// import { UserListSkeleton } from './user-list-skeleton';
// import { useUsersStore } from "@/store/users-store";
// import { usePrintQueueStore } from "@/store/print-queue-store";

// interface UserListProps {
// }

// export function UserList({ }: UserListProps) {
//   const [search, setSearch] = useState("");
//   const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(new Set()));

//   const { users, fetchUsers, isLoading } = useUsersStore()
//   const { printQueue, addUser, addGroup } = usePrintQueueStore();



//   const printQueueNums = useMemo(() => new Set(printQueue.map((u) => u.num)), [printQueue]);

//   const filteredUsers = useMemo(() => {
//     if (!search.trim()) return users;

//     const searchLower = search.toLowerCase();
//     const filtered: UsersResponse = {};

//     for (const [groupName, groupUsers] of Object.entries(users)) {
//       const matchedUsers = groupUsers.filter((user) =>
//         user.username.toLowerCase().includes(searchLower)
//       );
//       if (matchedUsers.length > 0) {
//         filtered[groupName] = matchedUsers;
//       }
//     }

//     return filtered;
//   }, [users, search]);

//   const toggleGroup = (groupName: string) => {
//     setExpandedGroups((prev) => {
//       const next = new Set(prev);
//       if (next.has(groupName)) {
//         next.delete(groupName);
//       } else {
//         next.add(groupName);
//       }
//       return next;
//     });
//   };

//   const getAvailableGroupUsers = (groupUsers: User[]) => {
//     return groupUsers.filter((user) => !printQueueNums.has(user.num));
//   };


//   useEffect(() => {
//     fetchUsers()
//   }, []);

//   if (isLoading) {
//     return <UserListSkeleton />;
//   }

//   return (
//     <div className="flex h-full flex-col border-r border-border">
//       <div className="border-b border-border p-4">
//         <h2 className="mb-3 text-sm font-medium text-foreground">Пользователи</h2>
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Поиск по имени..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//       </div>

//       <ScrollArea className="flex-1">
//         <div className="p-2">
//           {Object.entries(filteredUsers).map(([groupName, groupUsers]) => {
//             const isExpanded = expandedGroups.has(groupName);
//             const availableUsers = getAvailableGroupUsers(groupUsers);

//             return (
//               <div key={groupName} className="mb-2">
//                 <div className="flex items-center gap-1 rounded-md bg-secondary/50 p-2">
//                   <button
//                     onClick={() => toggleGroup(groupName)}
//                     className="flex flex-1 items-center gap-2 text-left"
//                   >
//                     {isExpanded ? (
//                       <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                     )}
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-medium text-foreground">{groupName}</span>
//                     <span className="text-xs text-muted-foreground">({groupUsers.length})</span>
//                   </button>
//                   {availableUsers.length > 0 && (
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="h-7 px-2 text-xs"
//                       onClick={() => addGroup(groupName, availableUsers)}
//                     >
//                       <Plus className="mr-1 h-3 w-3" />
//                       Все
//                     </Button>
//                   )}
//                 </div>

//                 {isExpanded && (
//                   <div className="mt-1 space-y-1 pl-4">
//                     {groupUsers.map((user) => {
//                       const isInQueue = printQueueNums.has(user.num);

//                       return (
//                         <div
//                           key={user.num}
//                           className={`flex items-center gap-3 rounded-md p-2 transition-colors ${isInQueue ? "opacity-50" : "hover:bg-secondary/30"
//                             }`}
//                         >
//                           <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
//                             {user.photo ? (
//                               <img
//                                 src={user.photo ? `data:image/jpeg;base64,${user.photo}` : undefined}
//                                 alt={user.username}
//                                 className="h-full w-full object-cover"
//                               />
//                             ) : (
//                               <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
//                                 {user.username.charAt(0).toUpperCase()}
//                               </div>
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm text-foreground break-words leading-tight">{user.username}</p>
//                           </div>
//                           {!isInQueue && (
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-7 shrink-0 px-2 text-xs"
//                               onClick={() => addUser(user)}
//                             >
//                               <Plus className="mr-1 h-3 w-3" />
//                               Добавить
//                             </Button>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {Object.keys(filteredUsers).length === 0 && (
//             <div className="py-8 text-center text-sm text-muted-foreground">
//               Пользователи не найдены
//             </div>
//           )}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Users, ChevronDown, ChevronRight, X, RefreshCw } from "lucide-react";
import type { User, UsersResponse } from "@/types/user";
import { UserListSkeleton } from './user-list-skeleton';
import { useUsersStore } from "@/store/users-store";
import { usePrintQueueStore } from "@/store/print-queue-store";

interface UserListProps {
}

export function UserList({ }: UserListProps) {
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(new Set()));

  const { users, fetchUsers, isLoading } = useUsersStore()
  const { printQueue, addUser, addGroup } = usePrintQueueStore();

  const printQueueNums = useMemo(() => new Set(printQueue.map((u) => u.num)), [printQueue]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const searchLower = search.toLowerCase();
    const filtered: UsersResponse = {};

    for (const [groupName, groupUsers] of Object.entries(users)) {
      const matchedUsers = groupUsers.filter((user) =>
        user.username.toLowerCase().includes(searchLower)
      );
      if (matchedUsers.length > 0) {
        filtered[groupName] = matchedUsers;
      }
    }

    return filtered;
  }, [users, search]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const getAvailableGroupUsers = (groupUsers: User[]) => {
    return groupUsers.filter((user) => !printQueueNums.has(user.num));
  };

  const clearSearch = () => {
    setSearch("");
  };

  const handleRefresh = async () => {
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers()
  }, []);

  if (isLoading) {
    return <UserListSkeleton />;
  }

  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="border-b border-border p-4">
        <h2 className="mb-3 text-sm font-medium text-foreground">Пользователи</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Очистить поиск"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(filteredUsers).map(([groupName, groupUsers]) => {
            const isExpanded = expandedGroups.has(groupName);
            const availableUsers = getAvailableGroupUsers(groupUsers);

            return (
              <div key={groupName} className="mb-2">
                <div className="flex items-center gap-1 rounded-md bg-secondary/50 p-2">
                  <button
                    onClick={() => toggleGroup(groupName)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{groupName}</span>
                    <span className="text-xs text-muted-foreground">({groupUsers.length})</span>
                  </button>
                  {availableUsers.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => addGroup(groupName, availableUsers)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Все
                    </Button>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-1 space-y-1 pl-4">
                    {groupUsers.map((user) => {
                      const isInQueue = printQueueNums.has(user.num);

                      return (
                        <div
                          key={user.num}
                          className={`flex items-center gap-3 rounded-md p-2 transition-colors ${isInQueue ? "opacity-50" : "hover:bg-secondary/30"
                            }`}
                        >
                          <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                            {user.photo ? (
                              <img
                                src={user.photo ? `data:image/jpeg;base64,${user.photo}` : undefined}
                                alt={user.username}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground break-words leading-tight">{user.username}</p>
                          </div>
                          {!isInQueue && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 shrink-0 px-2 text-xs"
                              onClick={() => addUser(user)}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Добавить
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {Object.keys(filteredUsers).length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Пользователи не найдены
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
