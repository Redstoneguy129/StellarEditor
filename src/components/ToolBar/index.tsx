import { FC } from 'react';

import { ReactComponent as MoreOptionsIcon } from 'assets/icons/more-options.svg';

import './index.scss';

const Container: FC = ({ children }) => {
  return <div className="tool-bar">{children}</div>;
};

const Button: FC = ({ children }) => {
  return (
    <button
      className={`
        tool-bar-button
        ${typeof children === 'string' ? 'tool-bar-text-button' : ''}
      `}
    >
      {children}
    </button>
  );
};

const Seperator = () => {
  return <div className="tool-bar-seperator" />;
};

const StaticIcon: FC = ({ children }) => {
  return <div className="tool-bar-static-icon">{children}</div>;
};

interface IDropDownButton {
  icon: object;
}
const DropDownButton: FC<IDropDownButton> = ({ children, icon }) => {
  return (
    <div className="tool-bar-drop-down-button-container">
      <button className="tool-bar-drop-down-button-action">{icon}</button>
      <button className="tool-bar-drop-down-button-more-options">
        <MoreOptionsIcon />
      </button>
      <div className="tool-bar-drop-down-button-container">
        {/* this component's visibility will be toggled */}
        {children}
      </div>
    </div>
  );
};

export default {
  Container,
  Button,
  Seperator,
  StaticIcon,
  DropDownButton,
};
