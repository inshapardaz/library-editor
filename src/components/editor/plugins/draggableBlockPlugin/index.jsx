import PropTypes from 'prop-types';
import { useRef } from 'react';

// Lexical import
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';

// Local imports
import { IconGripVertical } from '@/components/icons';
import './index.css';

//----------------------------------------

const DraggableBlockPlugin = ({ anchorElem = document.body }) => {
  const menuRef = useRef(null);
  const targetLineRef = useRef(null);
  const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
  const DRAGGABLE_BLOCK_TARGET_LINE_CLASSNAME = 'draggable-block-target-line';

  const isOnMenu = (element) => {
    return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className={`icon ${DRAGGABLE_BLOCK_MENU_CLASSNAME}`}>
          <IconGripVertical />
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className={DRAGGABLE_BLOCK_TARGET_LINE_CLASSNAME} />
      }
      isOnMenu={isOnMenu}
    />
  );
}

DraggableBlockPlugin.propTypes = {
  anchorElem: PropTypes.any
}
export default DraggableBlockPlugin;