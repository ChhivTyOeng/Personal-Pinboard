import React from "react";
import { Table, Avatar, Badge, ActionIcon, Menu, Text } from "@mantine/core";
import {
  IconDotsVertical,
  IconTrash,
  IconShield,
  IconUser,
  IconUserOff,
  IconUserCheck,
  IconEye,
} from "@tabler/icons-react";
import { formatDate } from "../../utils/formatDate";

export default function UserTable({
  users = [],
  onRoleChange,
  onStatusChange,
  onDeleteUser,
  onViewUser,
}) {
  if (!users || users.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-12 text-center">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          No Users Found
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          There are no registered user accounts to display.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 1. Mobile Card List View (< md) */}
      <div className="md:hidden space-y-3">
        {users.map((user) => {
          const isSuspended = user.status === "suspended";
          return (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-3"
            >
              {/* User Identity & Role Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={user.avatar_url} radius="xl" size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <Badge
                  color={user.role === "admin" ? "red" : "gray"}
                  variant="light"
                  size="sm"
                  className="font-bold uppercase tracking-wider shrink-0"
                >
                  {user.role}
                </Badge>
              </div>

              {/* User Details Grid */}
              <div className="bg-slate-50/75 dark:bg-slate-800/40 rounded-xl p-2.5 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-[11px] truncate max-w-[200px]">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account Status:</span>
                  <Badge
                    color={isSuspended ? "orange" : "teal"}
                    variant="dot"
                    size="xs"
                    className="font-semibold"
                  >
                    {isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Activity:</span>
                  <span className="font-medium">
                    {user.pins_count || 0} pins · {user.boards_count || 0}{" "}
                    boards
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Joined:</span>
                  <span>{formatDate(user.created_at)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    onRoleChange(
                      user.id,
                      user.role === "admin" ? "user" : "admin",
                    )
                  }
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all text-center"
                >
                  {user.role === "admin" ? (
                    <IconUser size={13} />
                  ) : (
                    <IconShield size={13} />
                  )}
                  <span>{user.role === "admin" ? "Demote" : "Admin"}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onStatusChange(
                      user.id,
                      isSuspended ? "active" : "suspended",
                    )
                  }
                  className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[11px] font-bold active:scale-95 transition-all cursor-pointer ${
                    isSuspended
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                      : "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                  }`}
                >
                  {isSuspended ? (
                    <IconUserCheck size={13} />
                  ) : (
                    <IconUserOff size={13} />
                  )}
                  <span>{isSuspended ? "Activate" : "Suspend"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteUser(user)}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200/80 dark:border-red-900/60 text-[11px] font-bold active:scale-95 transition-all cursor-pointer"
                >
                  <IconTrash size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Table View (>= md) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <Table
            verticalSpacing="sm"
            horizontalSpacing="md"
            highlightOnHover
            className="min-w-[740px]"
          >
            <Table.Thead className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <Table.Tr>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  User
                </Table.Th>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Email
                </Table.Th>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Role
                </Table.Th>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Activity
                </Table.Th>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Joined
                </Table.Th>
                <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => {
                const isSuspended = user.status === "suspended";
                return (
                  <Table.Tr
                    key={user.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <Table.Td className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar_url} radius="xl" size="sm" />
                        <div>
                          <Text
                            size="sm"
                            fw={600}
                            className="text-slate-900 dark:text-white leading-tight"
                          >
                            {user.full_name || user.username}
                          </Text>
                          <Text size="xs" c="dimmed">
                            @{user.username}
                          </Text>
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap">
                      <Text
                        size="sm"
                        className="text-slate-600 dark:text-slate-300"
                      >
                        {user.email}
                      </Text>
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap">
                      <Badge
                        color={user.role === "admin" ? "red" : "gray"}
                        variant="light"
                        size="sm"
                        className="font-bold uppercase tracking-wider"
                      >
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap">
                      <Badge
                        color={isSuspended ? "orange" : "teal"}
                        variant="dot"
                        size="sm"
                        className="font-semibold"
                      >
                        {isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap">
                      <Text
                        size="sm"
                        className="text-slate-600 dark:text-slate-300"
                      >
                        {user.pins_count || 0} pins · {user.boards_count || 0}{" "}
                        boards
                      </Text>
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap">
                      <Text size="xs" c="dimmed">
                        {formatDate(user.created_at)}
                      </Text>
                    </Table.Td>
                    <Table.Td align="right" className="whitespace-nowrap">
                      <Menu shadow="md" width={180} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          {onViewUser && (
                            <Menu.Item
                              leftSection={<IconEye size={15} />}
                              onClick={() => onViewUser(user)}
                            >
                              View User Details
                            </Menu.Item>
                          )}

                          <Menu.Item
                            leftSection={
                              user.role === "admin" ? (
                                <IconUser size={15} />
                              ) : (
                                <IconShield size={15} />
                              )
                            }
                            onClick={() =>
                              onRoleChange(
                                user.id,
                                user.role === "admin" ? "user" : "admin",
                              )
                            }
                          >
                            Make {user.role === "admin" ? "User" : "Admin"}
                          </Menu.Item>

                          <Menu.Item
                            leftSection={
                              isSuspended ? (
                                <IconUserCheck size={15} />
                              ) : (
                                <IconUserOff size={15} />
                              )
                            }
                            color={isSuspended ? "teal" : "orange"}
                            onClick={() =>
                              onStatusChange(
                                user.id,
                                isSuspended ? "active" : "suspended",
                              )
                            }
                          >
                            {isSuspended ? "Activate User" : "Suspend User"}
                          </Menu.Item>

                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={15} />}
                            onClick={() => onDeleteUser(user)}
                          >
                            Delete Account
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
