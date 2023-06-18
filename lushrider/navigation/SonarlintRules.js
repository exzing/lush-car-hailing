/**
 * 1. 
 * Sections of code should not be commented out (javascript:S125)
    CODE_SMELL  Code Smell  MAJOR  Major
    Programmers should not comment out code as it bloats programs and reduces readability.
Unused code should be deleted and can be retrieved from source control history if required.
 */

//2.
// React components should not be nested (javascript:S6478)
// CODE_SMELL  Code Smell  MAJOR  Major
// Nested components are defined in an enclosing one and can be simple functions or arrow expressions. React recreates them systematically during the render pass because it doesn’t know they haven’t changed. This hurts performance as the components are recreated too many times. However, this can also hide surprising bugs where the state of the nested components is lost between renders. Trying to use useCallback hooks for child components is also discouraged. You should actually refactor this code to define a component on its own, passing props if needed.

// Noncompliant Code Example
function Component() {
  function UnstableNestedComponent() {
    return <div />;
  }

  return (
    <div>
      <UnstableNestedComponent />
    </div>
  );
}
function SomeComponent({footer: Footer}) {
  return (
    <div>
      <Footer />
    </div>
  );
}

function Component() {
  return (
    <div>
      <SomeComponent footer={() => <div />} />{' '}
      {/* footer is a component nested inside 'Component' */}
    </div>
  );
}
class Component extends React.Component {
  render() {
    function UnstableNestedComponent() {
      return <div />;
    }

    return (
      <div>
        <UnstableNestedComponent />
      </div>
    );
  }
}
// Compliant Solution
function OutsideDefinedComponent(props) {
  return <div />;
}

function Component() {
  return (
    <div>
      <OutsideDefinedComponent />
    </div>
  );
}
function Component() {
  return <SomeComponent footer={<div />} />;
}
class Component extends React.Component {
  render() {
    return (
      <div>
        <SomeComponent />
      </div>
    );
  }
}
// See
// Elements Of Different Types - React documentation (https://legacy.reactjs.org/docs/reconciliation.html#elements-of-different-types)
