import { Form } from 'react-bootstrap';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import React from 'react';

import { WEBSITE_COLOR } from '@/config';

const StyledFormCheckWrapper = styled.div`
  .form-check-input:checked {
    background-color: ${WEBSITE_COLOR.mainColor};
    border-color: ${WEBSITE_COLOR.mainColor};
  }

  .form-check-input:focus {
    box-shadow: 0 0 0 0.25rem ${WEBSITE_COLOR.boxShadowColor};
  }

  .form-check-input:disabled ~ .form-check-label {
    color: ${WEBSITE_COLOR.mainLighterColor};
  }

  .form-check-input:checked ~ .form-check-label::before {
    background-color: ${WEBSITE_COLOR.mainColor};
  }

  .form-switch .form-check-input:checked ~ .form-check-label::before {
    border-color: ${WEBSITE_COLOR.mainColor};
  }

  .form-check-label::before {
    border-color: ${WEBSITE_COLOR.mainColor};
  }
`;

interface SortableItemProps {
  id: string;
  index: number;
  content: string;
  enableDrag: boolean;
  toggleEnable: (id: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  index,
  content,
  enableDrag,
  toggleEnable,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
      disabled: !enableDrag,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    margin: '5px 0',
    backgroundColor: enableDrag ? 'white' : 'lightgray',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    touchAction: 'none',
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    toggleEnable(id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>
        {index + 1} {content}
      </span>
      <StyledFormCheckWrapper>
        <Form.Check
          type='switch'
          id={`order-element-${id}`}
          checked={enableDrag}
          onChange={handleToggle}
        />
      </StyledFormCheckWrapper>
    </div>
  );
};
