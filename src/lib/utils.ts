import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Returns a string with the first letter of each word capitalized.
 * @param {string} text The string to be converted
 * @returns {string} The string with the first letter of each word capitalized
 * @example
 * toTitleCase('hello world') // 'Hello World'
 */
/*******  15f726db-d6c7-45ab-98bf-755da8147824  *******/ export function toTitleCase(
  text: string
): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeRole(role: string) {
  if (role === "admin") {
    return "admin";
  } else if (role === "admin_pengajuan") {
    return "admin-pengajuan";
  } else if (role === "admin_pembelian") {
    return "admin-pembelian";
  } else if (role === "viewer") {
    return "viewer";
  } else if (role === "admin_pengadaan") {
    return "admin-pengadaan";
  } else if (role === "admin_gudang") {
    return "admin-gudang";
  } else if (role === "ketua_tim") {
    return "ketua-tim";
  } else {
    return "operator-ruangan";
  }
}
export const downloadExcel = (data: object[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName + ".xlsx");
};

export const numToIndonesiaMonth = (num: string) => {
  const months = {
    "01": "Januari",
    "02": "Februari",
    "03": "Maret",
    "04": "April",
    "05": "Mei",
    "06": "Juni",
    "07": "Juli",
    "08": "Agustus",
    "09": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember",
  };
  return months[num as keyof typeof months];
};

export const IndonesiaMonthToNum = (month: string) => {
  const months = {
    Januari: "01",
    Februari: "02",
    Maret: "03",
    April: "04",
    Mei: "05",
    Juni: "06",
    Juli: "07",
    Agustus: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Desember: "12",
  };
  return months[month as keyof typeof months];
};

export const MONTHS = {
  "01": "Januari",
  "02": "Februari",
  "03": "Maret",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Agustus",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember",
};
