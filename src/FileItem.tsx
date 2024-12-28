import { ChevronDown, ChevronRight, FileIcon, FolderIcon } from "lucide-react";
import { FileItemProps } from "./types";

const FileItem: React.FC<FileItemProps> = ({
    item,
    depth,
    path,
    isExpanded,
    onToggle,
    expandedFolders
}) => {
    const currentPath = `${path}/${item.name}`;

    return (
        <div>
            <div
                className="item"
                style={{ paddingLeft: `${depth * 20}px` }}
                onClick={() => item.type === 'directory' && onToggle(currentPath)}
            >
                <div className="item-content">
                    {item.type === 'directory' && (
                        <span className="item-icon">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    )}
                    <span className={`item-icon ${item.type === 'directory' ? 'folder-icon' : 'file-icon'}`}>
                        {item.type === 'directory' ? <FolderIcon size={16} /> : <FileIcon size={16} />}
                    </span>
                    <span className="item-name">{item.name}</span>
                </div>
            </div>
            {item.type === 'directory' && isExpanded && item.children?.map(child => (
                <FileItem /* recursion for nested items */
                    key={`${currentPath}/${child.name}`}
                    item={child}
                    depth={depth + 1}
                    path={currentPath}
                    isExpanded={expandedFolders.has(`${currentPath}/${child.name}`)}
                    onToggle={onToggle}
                    expandedFolders={expandedFolders}
                />
            ))}
        </div>
    );
};

export default FileItem;