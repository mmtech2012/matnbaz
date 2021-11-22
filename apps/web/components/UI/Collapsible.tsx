import classNames from 'classnames';
import { useRef, useState } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { HiChevronDown } from 'react-icons/hi';

interface ICollapsibleProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  open?: boolean;
}

const Collapsible = ({
  children,
  title = 'باز کردن',
  className,
  open: initialOpen = false,
}: ICollapsibleProps) => {
  const childrenRef = useRef(null);
  const [open, setOpen] = useState(initialOpen);
  return (
    <div
      ref={childrenRef}
      className={classNames(
        className,
        'border border-white dark:border-gray-700 w-full h-auto rounded-lg flex flex-col px-4 pt-2 pb-4 transition-all ease-in-out duration-700 overflow-hidden space-y-4'
      )}
      style={{
        maxHeight: open
          ? (childrenRef?.current?.parentElement?.clientHeight || 400) +
            30 +
            'px'
          : '45px',
      }}
    >
      <button
        type="button"
        className="w-full text-right flex items-center space-x-0.5 space-x-reverse text-gray-700 dark:text-gray-300"
        onClick={() => {
          setOpen((previousOpen) => !previousOpen);
        }}
      >
        <HiChevronDown
          className={classNames(
            open && 'transform rotate-180',
            'fill-current w-4 h-4 transition-all duration-300'
          )}
        />
        <span>{title}</span>
      </button>
      <div>{children}</div>
    </div>
  );
};

export default Collapsible;
