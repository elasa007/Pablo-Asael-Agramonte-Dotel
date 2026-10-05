/**
 * Configuración de Base de Datos y Backend
 * 
 * Este archivo implementa:
 * 1. Configuración de Firebase (Firestore, Auth, Storage) para despliegues estándar.
 * 2. Adaptador y Código de Google Apps Script (Drive + Google Sheets API) como alternativa 
 *    serverless gratuita de alta velocidad y cero coste de servidor.
 */

// ==========================================
// 1. CONFIGURACIÓN FIREBASE (Producción)
// ==========================================

export const firebaseConfigTemplate = {
  apiKey: "AIzaSyDummyKey_ReplaceWithYourActualKey",
  authDomain: "tu-portafolio-creativo.firebaseapp.com",
  projectId: "tu-portafolio-creativo",
  storageBucket: "tu-portafolio-creativo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

/**
 * Código JavaScript para inicializar Firebase en un proyecto Next.js / React:
 * (Archivo: lib/firebase.js o src/services/firebase.ts)
 */
export const FIREBASE_SETUP_CODE = `
// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Singleton initialization pattern
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
`;

// ===================================================
// 2. ARQUITECTURA GOOGLE APPS SCRIPT (DRIVE + SHEETS)
// ===================================================

/**
 * Código de Google Apps Script (Code.gs)
 * Permite recibir peticiones POST y GET desde Next.js / React para:
 * 1. Guardar metadatos en Google Sheets
 * 2. Guardar archivos de imagen/video en una carpeta dedicada de Google Drive
 * 3. Devolver la URL pública del archivo en Google Drive
 */
export const GOOGLE_APPS_SCRIPT_CODE = `
/**
 * Google Apps Script - API Serverless para Portafolio Creativo
 * Despliega este script como Aplicación Web (Web App) con acceso: "Cualquiera (Anyone)"
 */

const SHEET_NAME = "Proyectos";
const DRIVE_FOLDER_ID = "TU_DRIVE_FOLDER_ID_AQUI"; // ID de carpeta en Google Drive

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["id", "title", "category", "description", "client", "year", "imageUrl", "tags", "createdAt"]);
    }
    
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = [];
    
    for (let i = 1; i < rows.length; i++) {
      let item = {};
      for (let j = 0; j < headers.length; j++) {
        item[headers[j]] = rows[i][j];
      }
      data.push(item);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action || "create_project";
    
    if (action === "create_project") {
      let imageUrl = payload.imageUrl || "";
      
      // Si se envía base64 de la imagen, guardarla en Google Drive
      if (payload.imageBase64 && payload.fileName) {
        const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        const contentType = payload.contentType || "image/jpeg";
        const decodedBytes = Utilities.base64Decode(payload.imageBase64.split(",")[1] || payload.imageBase64);
        const blob = Utilities.newBlob(decodedBytes, contentType, payload.fileName);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        imageUrl = file.getUrl();
      }
      
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(["id", "title", "category", "description", "client", "year", "imageUrl", "tags", "createdAt"]);
      }
      
      const id = "proj_" + new Date().getTime();
      const createdAt = new Date().toISOString();
      const tagsStr = Array.isArray(payload.tags) ? payload.tags.join(",") : (payload.tags || "");
      
      sheet.appendRow([
        id,
        payload.title || "Sin título",
        payload.category || "Social Media",
        payload.description || "",
        payload.client || "",
        payload.year || new Date().getFullYear(),
        imageUrl,
        tagsStr,
        createdAt
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: "success", 
          project: { id, title: payload.title, imageUrl, createdAt } 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Acción no reconocida" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
