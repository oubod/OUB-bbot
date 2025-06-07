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
import { AvatarShape, AvatarPattern } from '@/components/demo/avatar-3d/Avatar3D';
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
  const [editableAvatarShape, setEditableAvatarShape] = useState<AvatarShape>(currentAgent.avatarShape || 'sphere');
  const [editableAvatarPattern, setEditableAvatarPattern] = useState<AvatarPattern>(currentAgent.avatarPattern || 'solid');
  const [editableHasHat, setEditableHasHat] = useState<boolean>(currentAgent.hasHat || false);

  useEffect(() => {
    setEditableName(currentAgent.name);
    setEditablePersonality(currentAgent.personality);
    setEditableBodyColor(currentAgent.bodyColor);
    setEditableVoice(currentAgent.voice);
    setEditableAvatarShape(currentAgent.avatarShape || 'sphere');
    setEditableAvatarPattern(currentAgent.avatarPattern || 'solid');
    setEditableHasHat(currentAgent.hasHat || false);
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
      avatarShape: editableAvatarShape,
      avatarPattern: editableAvatarPattern,
      hasHat: editableHasHat,
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
          <div>
            <label htmlFor="avatarShapeSelect">Avatar Shape</label>
            <select
              id="avatarShapeSelect"
              value={editableAvatarShape}
              onChange={e => {
                setEditableAvatarShape(e.target.value as AvatarShape);
              }}
              style={{
                padding: '10px',
                border: '1px solid var(--Neutral-30, #404547)',
                backgroundColor: 'var(--Neutral-10, #1c1f21)',
                color: 'var(--text, white)',
                borderRadius: '8px',
                width: '100%', // Make select full width of its container
              }}
            >
              <option value="sphere">Sphere</option>
              <option value="cube">Cube</option>
              <option value="torus">Torus</option>
            </select>
          </div>
          <div>
            <label htmlFor="avatarPatternSelect">Avatar Pattern</label>
            <select
              id="avatarPatternSelect"
              value={editableAvatarPattern}
              onChange={e => setEditableAvatarPattern(e.target.value as AvatarPattern)}
              style={{
                padding: '10px',
                border: '1px solid var(--Neutral-30, #404547)',
                backgroundColor: 'var(--Neutral-5, #181a1b)',
                color: 'var(--Neutral-90, #e1e2e3)',
                borderRadius: '8px',
                marginTop: '5px',
                width: '100%',
              }}
            >
              <option value="solid">Solid</option>
              <option value="stripes">Stripes</option>
              <option value="polkaDots">Polka Dots</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
            <input
              type="checkbox"
              id="hasHatCheckbox"
              checked={editableHasHat}
              onChange={e => setEditableHasHat(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: `var(--Blue-500, #007bff)`,
              }}
            />
            <label htmlFor="hasHatCheckbox" style={{ userSelect: 'none', cursor: 'pointer' }}>
              Enable Hat
            </label>
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
