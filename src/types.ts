declare global {
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }
}

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface FileItemProps {
  item: FileNode;
  depth: number;
  path: string;
  isExpanded: boolean;
  onToggle: (path: string) => void;
  expandedFolders: Set<string>;
}

export {};