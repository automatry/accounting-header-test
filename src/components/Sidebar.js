import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Sidebar({
    headers = [],
    customHeaders = [],
    selectedHeader,
    onSelectHeader,
    onClearSelection,
    onFinalizeCodes,
    onCreateCustomHeader,
    onDeleteCustomHeader,
    onReorderHeaders,
    message
}) {
    const [creatingHeader, setCreatingHeader] = useState(false);
    const [newHeader, setNewHeader] = useState("");
    const [error, setError] = useState("");

    const handleCreateHeader = () => {
        if (headers.includes(newHeader) || customHeaders.includes(newHeader)) {
            setError("Cost code already exists");
        } else {
            onCreateCustomHeader(newHeader);
            setNewHeader("");
            setCreatingHeader(false);
            setError("");
        }
    };

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.index === source.index) return;

        const isCustom = draggableId.startsWith('custom-');
        const headerArray = isCustom ? customHeaders : headers;
        const newArray = Array.from(headerArray);
        const [moved] = newArray.splice(source.index, 1);
        newArray.splice(destination.index, 0, moved);
        onReorderHeaders(newArray, isCustom);
    };

    const combinedHeaders = [
        ...customHeaders.map(header => ({ id: `custom-${header}`, content: header })),
        ...headers.map(header => ({ id: `generated-${header}`, content: header }))
    ];

    return (
        <div className="sidebar">
            <button onClick={onClearSelection} className="button">
                Clear Selection
            </button>
            <button onClick={() => setCreatingHeader(true)} className="button">
                Create Custom Header
            </button>
            {creatingHeader && (
                <div>
                    <input
                        type="text"
                        value={newHeader}
                        onChange={(e) => setNewHeader(e.target.value)}
                        placeholder="Enter header name"
                        className="input-text"
                    />
                    <button onClick={handleCreateHeader} className="button">
                        Save Custom Header
                    </button>
                    {error && <p className="error">{error}</p>}
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="headers">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {combinedHeaders.map((header, index) => (
                                <Draggable
                                    key={header.id}
                                    draggableId={header.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="header-container"
                                        >
                                            <div
                                                className={`cost-code ${selectedHeader === header.content ? 'selected' : ''}`}
                                                onClick={() => onSelectHeader(header.content)}
                                                title={header.content}
                                            >
                                                {header.content}
                                            </div>
                                            {header.id.startsWith('custom-') && (
                                                <button
                                                    className="delete-button"
                                                    onClick={() => onDeleteCustomHeader(header.content)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button onClick={onFinalizeCodes} className="button finalize-button">
                Finalize Codes
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Sidebar;
