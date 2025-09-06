type ArrowProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const CustomPrevArrow = ({ onClick }: ArrowProps) => (
  <div className="custom-arrow prev-arrow" onClick={onClick}>
   {'\u276E'} 
  </div>
);

export const CustomNextArrow = ({ onClick }: ArrowProps) => (
  <div className="custom-arrow next-arrow" onClick={onClick}>
    {'\u276F'}
  </div>
);