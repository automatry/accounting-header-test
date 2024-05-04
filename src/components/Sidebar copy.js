import React, { useState } from 'react';

function Sidebar({
    headers,
    customHeaders,
    selectedHeader,
    onSelectHeader,
    onClearSelection,
    onFinalizeCodes,
    onCreateCustomHeader,
    onDeleteCustomHeader,
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

    return (
        <div className="sidebar">
            <button
                onClick={() => onClearSelection()}
                className="button"
            >
                Clear Selection
            </button>
            <button
                onClick={() => setCreatingHeader(true)}
                className="button"
            >
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
                    <button
                        onClick={handleCreateHeader}
                        className="button"
                    >
                        Save Custom Header
                    </button>
                    {error && <p className="error">{error}</p>}
                </div>
            )}
            <h2>Custom Headers</h2>
            {customHeaders.map((header, index) => (
                <div key={index} className="header-container">
                    <div
                        className={`cost-code ${selectedHeader === header ? 'selected' : ''}`}
                        onClick={() => onSelectHeader(header)}
                        title={header}
                    >
                        {header}
                    </div>
                    <button
                        className="delete-button"
                        onClick={() => onDeleteCustomHeader(header)}
                    >
                        Delete
                    </button>
                </div>
            ))}
            <h2>Generated Headers</h2>
            {headers.map((header, index) => (
                <div key={index} className="header-container">
                    <div
                        className={`cost-code ${selectedHeader === header ? 'selected' : ''}`}
                        onClick={() => onSelectHeader(header)}
                        title={header}
                    >
                        {header}
                    </div>
                </div>
            ))}
            <button
                onClick={onFinalizeCodes}
                className="button finalize-button"
            >
                Finalize Codes
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Sidebar;