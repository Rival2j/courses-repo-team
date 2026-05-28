declare module "react-rating-stars-component" {
  import type { ComponentType, HTMLAttributes } from "react";

  export interface ReactStarsProps extends HTMLAttributes<HTMLElement> {
    count?: number;
    onChange?: (value: number) => void;
    size?: number;
    isHalf?: boolean;
    value?: number;
    activeColor?: string;
    color?: string;
    edit?: boolean;
    a11y?: boolean;
    emptyIcon?: JSX.Element;
    halfIcon?: JSX.Element;
    filledIcon?: JSX.Element;
  }

  const ReactStars: ComponentType<ReactStarsProps>;
  export default ReactStars;
}
