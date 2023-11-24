import {
  List,
  ClipboardList,
  Home,
  RefreshCcw,
  UserCircle2,
  Building2,
  Cpu,
  Group,
  FileClock,
} from "lucide-react";

export const mainRoutes = [
  {
    icon: Home,
    label: "홈",
    href: "/",
  },
  {
    icon: Cpu,
    label: "시스템 관리",
    href: "/system",
  },
  {
    icon: UserCircle2,
    label: "사용자 관리",
    href: "/user",
  },
  {
    icon: Group,
    label: "부서관리",
    href: "/department",
  },
  {
    icon: Building2,
    label: "조직개편",
    href: "/restructure",
  },
  {
    icon: RefreshCcw,
    label: "동기화",
    href: "/sync",
  },
  {
    icon: FileClock,
    label: "통합 변경 이력",
    href: "/log",
  },
  {
    icon: ClipboardList,
    label: "게시판",
    href: "/board",
  },
];

export const adminRoutes = [
  {
    icon: List,
    label: "Business",
    href: "/business",
  },
];

export const boardRoutes = [
  {
    label: "통합 게시판",
    href: "/board",
  },
  {
    label: "QnA",
    href: "/board/qna",
  },
  {
    label: "공지사항",
    href: "/board/notice",
  },
];
