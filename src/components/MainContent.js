import React from 'react';


function MainContent({ orgData, selectedHeader, relatedCodes, onRelatedCodesSelect }) {
    return (
      <div className="main-content">
        {orgData.map((org, orgIndex) => (
          <div key={orgIndex} className="organization-column">
            <h2>{org.name}</h2>
            <ul>
              {org.costCodes.map((code, codeIndex) => {
                const isSelected = selectedHeader && relatedCodes[selectedHeader] &&
                                   relatedCodes[selectedHeader].includes(code);
                return (
                  <li key={codeIndex}
                      className={`org-cost-code ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        onRelatedCodesSelect(selectedHeader, code)
                      }>
                    {code}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
}
export default MainContent;