const FallBack = () => {
  return (
    <div className="bg-black fixed top-0 w-full h-svh left-0 z-30 justify-center flex items-center">
      <div className="spinner">
        <div className="r1"></div>
        <div className="r2"></div>
        <div className="r3"></div>
        <div className="r4"></div>
        <div className="r5"></div>
      </div>
    </div>
  );
};

export default FallBack;
