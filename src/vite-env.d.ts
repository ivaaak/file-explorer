/// <reference types="vite/client" />

interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}