/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useRef, useState, useEffect } from 'react';
import {
  Agent,
  AGENT_COLORS,
  INTERLOCUTOR_VOICE,
  INTERLOCUTOR_VOICES,
} from '@/lib/presets/agents';
import Modal from './Modal';
import c from 'classnames';
import { useAgent, useUI } from '@/lib/state';

export default function EditAgent() {
  const currentAgent = useAgent(state => state.current);
  const updateAgent = useAgent(state => state.update);
  const nameInput = useRef(null);
  const { setShowAgentEdit } = useUI();

  const [editableName, setEditableName] = useState(currentAgent.name);
  const [editablePersonality, setEditablePersonality] = useState(currentAgent.personality);
  const [editableBodyColor, setEditableBodyColor] = useState(currentAgent.bodyColor);
  const [editableVoice, setEditableVoice] = useState(currentAgent.voice);

  useEffect(() => {
    setEditableName(currentAgent.name);
    setEditablePersonality(currentAgent.personality);
    setEditableBodyColor(currentAgent.bodyColor);
    setEditableVoice(currentAgent.voice);
  }, [currentAgent]);

  function onClose() {
    setShowAgentEdit(false);
  }

  function handleSave() {
    updateAgent(currentAgent.id, {
      name: editableName,
      personality: editablePersonality,
      bodyColor: editableBodyColor,
      voice: editableVoice,
    });
    onClose(); // Close the modal after saving
  }

  return (
    <Modal onClose={onClose}>
      <div className="editAgent">
        <div>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <input
                className="largeInput"
                type="text"
                placeholder="Name"
                value={editableName}
                onChange={e => setEditableName(e.target.value)}
                ref={nameInput}
              />
            </div>

            <div>
              <label>
                Personality
                <textarea
                  value={editablePersonality}
                  onChange={e => setEditablePersonality(e.target.value)}
                  rows={7}
                  placeholder="How should I act? Whatʼs my purpose? How would you describe my personality?"
                />
              </label>
            </div>
          </form>
        </div>

        <div>
          <div>
            <ul className="colorPicker">
              {AGENT_COLORS.map((color, i) => (
                <li
                  key={i}
                  className={c({ active: color === editableBodyColor })}
                >
                  <button
                    type="button"
                    style={{ backgroundColor: color }}
                    onClick={() => setEditableBodyColor(color)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="voicePicker">
            Voice
            <select
              value={editableVoice}
              onChange={e => {
                setEditableVoice(e.target.value as INTERLOCUTOR_VOICE);
              }}
            >
              {INTERLOCUTOR_VOICES.map(voice => (
                <option key={voice} value={voice}>
                  {voice}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button primary" onClick={handleSave}>Save</button>
          <button type="button" className="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
