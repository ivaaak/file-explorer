import React, { useState } from 'react';
import './FileExplorer.css';
import { FileNode } from './types';
import FileItem from './FileItem';

const FileExplorer: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileStructure, setFileStructure] = useState<FileNode[] | null>(null);
  const [selectedDirectory, setSelectedDirectory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scanDirectory = async (
    dirHandle: FileSystemDirectoryHandle,
    path: string = ''
  ): Promise<FileNode[]> => {
    const entries: FileNode[] = [];
    
    try {
      // @ts-ignore: .values() exists but TS doesn't recognize it
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
          const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
          const children = await scanDirectory(subDirHandle, `${path}/${entry.name}`);
          entries.push({ name: entry.name, type: 'directory', children });
        } else {
          entries.push({ name: entry.name, type: 'file' });
        }
      }
    } catch (error) {
      console.error('Error scanning directory:', error);
    }

    return entries.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  };

  const handleFileSelect = async (): Promise<void> => {
    if (!('showDirectoryPicker' in window)) {
      console.error('File System Access API is not supported in this browser');
      return;
    }
  
    try {
      setIsLoading(true);
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      setSelectedDirectory(dirHandle.name);
      const fileTree = await scanDirectory(dirHandle);
      setFileStructure(fileTree);
    } catch (error) {
      console.error('Error accessing directory:', error);
      setSelectedDirectory("");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolder = (path: string): void => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="file-explorer">
      <div className="header">
        <button 
          className="select-button" 
          onClick={handleFileSelect}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Select Directory'}
        </button>
        {selectedDirectory && (
          <div className="selected-directory">
            Selected directory: <span className="directory-name">{selectedDirectory}</span>
          </div>
        )}
      </div>
      <div className="explorer-container">
        {fileStructure ? (
          fileStructure.map(item => (
            <FileItem
              key={item.name}
              item={item}
              depth={0}
              path=""
              isExpanded={expandedFolders.has(`/${item.name}`)}
              onToggle={toggleFolder}
              expandedFolders={expandedFolders}
            />
          ))
        ) : (
          <div className="empty-state">
            Select a directory to view its structure
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;