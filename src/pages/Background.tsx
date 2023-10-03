import "./Background.css"

const Background = (mainBlock: JSX.Element): JSX.Element => (
    <>
        <div className="background">
          <img className="logo" alt="Vector" src="logo.svg" />
          <div className="main-block">{ mainBlock }</div>
        </div>
    </>
);

export default Background;