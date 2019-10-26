import React, { useState } from "react";
import "./App.css";
import createReactClass from "create-react-class";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>React Components</h1>
      <CreateReactClassComponent countA={2} countB={20} propsOnlyValue={1000} />
      <hr />
      <ClassComponent countA={2} countB={20} propsOnlyValue={1000} />
      <hr />
      <PureComponentComponent countA={2} countB={20} propsOnlyValue={1000} />
      <hr />
      <StatelessFunctionalComponent
        countA={2}
        countB={20}
        propsOnlyValue={1000}
      />
      <hr />
      <FunctionalComponent countA={2} countB={20} propsOnlyValue={1000} />
      <hr />
      <HigherOrderdComponent />
      <hr />
      <WithRenderPropsComponent
        render={props => (
          <ClassComponent propsOnlyValue={1000}>{props}</ClassComponent>
        )}
      />
      <hr />
    </div>
  );
};

export default App;

// Props用の型
interface Props {
  countA?: number;
  countB?: number;
  propsOnlyValue: number;
}

// State用の型
interface State {
  countA: number;
  countB: number;
}

// ES6が使えなかったときは関数にクラスを作らせていた
// mixinも使えたりする
// @see https://ja.reactjs.org/docs/react-without-es6.html
const CreateReactClassComponent = createReactClass<Props, State>({
  getInitialState: function() {
    return { countA: this.props.countA, countB: this.props.countB };
  },
  onClickA: function() {
    this.setState(state => ({ ...state, countA: state.countA + 1 }));
  },
  onClickB: function() {
    this.setState(state => ({ ...state, countB: state.countB + 10 }));
  },
  render: function() {
    return (
      <div>
        <h2>This is a ReactCreateClassComponent</h2>
        <div>
          countA: {this.state.countA}{" "}
          <button onClick={this.onClickA}>Click!</button>
        </div>

        <div>
          countB: {this.state.countB}{" "}
          <button onClick={this.onClickB}>Click!</button>
        </div>
        <div>propsOnlyValue: {this.props.propsOnlyValue}</div>
        <div>{this.props.children}</div>
      </div>
    );
  }
});

// 今までの普通のClassbasedなコンポーネント
// @see https://ja.reactjs.org/docs/react-component.html
class ClassComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      countA: this.props.countA || 1,
      countB: this.props.countB || 10
    };
  }

  onClickA() {
    this.setState(state => ({ ...state, countA: state.countA + 1 }));
  }

  onClickB() {
    this.setState(state => ({ ...state, countB: state.countB + 10 }));
  }

  render() {
    return (
      <div>
        <h2>This is ClassComponent</h2>
        <div>
          countA: {this.state.countA}{" "}
          <button onClick={this.onClickA.bind(this)}>Click!</button>
        </div>

        <div>
          countB: {this.state.countB}{" "}
          <button onClick={this.onClickB.bind(this)}>Click!</button>
        </div>
        <div>propsOnlyValue: {this.props.propsOnlyValue}</div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

// PureComponent
// @see https://ja.reactjs.org/docs/react-api.html#reactpurecomponent
class PureComponentComponent extends React.PureComponent<Props, State> {
  /*
  これを実装しているのと同じ
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props、nextProps)
  }
  ただしこれが呼ばれるコストももちろん発生する
  */

  constructor(props: Props) {
    super(props);
    this.state = {
      countA: this.props.countA || 1,
      countB: this.props.countB || 10
    };
  }

  onClickA() {
    this.setState(state => ({ ...state, countA: state.countA + 1 }));
  }

  onClickB() {
    this.setState(state => ({ ...state, countB: state.countB + 10 }));
  }

  render() {
    return (
      <div>
        <h2>This is a PureComponent</h2>
        <div>
          countA: {this.state.countA}{" "}
          <button onClick={this.onClickA.bind(this)}>Click!</button>
        </div>

        <div>
          countB: {this.state.countB}{" "}
          <button onClick={this.onClickB.bind(this)}>Click!</button>
        </div>
        <div>propsOnlyValue: {this.props.propsOnlyValue}</div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

// 可読性が高い
// 記述量が少ない
// パフォーマンスがよい
// @see https://ja.reactjs.org/docs/components-and-props.html#function-and-class-components
const FunctionalComponent: React.FC<Props> = props => {
  const [countA, setCountA] = useState(props.countA || 1);
  const [countB, setCountB] = useState(props.countB || 10);
  const onClickHandlerA = () => setCountA(countA => countA + 1); // 注釈 ホントはmemo化するべき
  const onClickHandlerB = () => setCountB(countB => countB + 1);

  return (
    <div>
      <h2>This is a FuncionalComponent</h2>
      <div>
        countA: {countA} <button onClick={onClickHandlerA}>Click!</button>
      </div>

      <div>
        countB: {countB} <button onClick={onClickHandlerB}>Click!</button>
      </div>
      <div>propsOnlyValue: {props.propsOnlyValue}</div>
      <div>{props.children}</div>
    </div>
  );
};

// StateをもたないComponent
const StatelessFunctionalComponent: React.FC<Props> = props => (
  <div>
    <h2>This is a StatelessFuncitonalComponent</h2>
    <div>countA: {props.countA}</div>

    <div>countB: {props.countB}</div>
    <div>propsOnlyValue: {props.propsOnlyValue}</div>
    <div>{props.children}</div>
  </div>
);

// HOCを使う場合の定義
// https://qiita.com/numanomanu/items/2b66d8b2887d44f857dc
// 複数利用
// https://github.com/acdlite/recompose/blob/master/docs/API.md#compose
const withHigherOrder: (
  SomeComponent: React.ComponentClass<Props, State>,
  props: Props
) => React.ComponentClass = SomeComponent =>
  class extends React.Component<Props, { text: string }> {
    constructor(props) {
      super(props);
      this.state = {
        text: ""
      };
    }
    componentDidMount() {
      const min = 30;
      const max = 100;
      const lineLength = Math.floor(Math.random() * (max + 1 - min)) + min;
      this.setState({
        text: `長さ ${lineLength} cmの正方形の面積は ${lineLength *
          2} 平方ｃｍです`
      });
    }
    render() {
      return (
        <div>
          <h2>This is a HigherOrderComponent</h2>
          <SomeComponent {...this.props}>{this.state.text}</SomeComponent>
        </div>
      );
    }
  };

const HigherOrderdComponent = withHigherOrder(ClassComponent, {
  propsOnlyValue: 1000
});

// RenderPropsを使ったコンポーネント
// @see https://ja.reactjs.org/docs/render-props.html
// RenderPropsとHOCのちがい
// https://qiita.com/shoichiimamura/items/1646d4cec14ab8da3be8
class WithRenderPropsComponent extends React.Component<
  { render: (props: string) => JSX.Element },
  { text: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }
  componentDidMount() {
    const min = 30;
    const max = 100;
    const lineLength = Math.floor(Math.random() * (max + 1 - min)) + min;
    this.setState({
      text: `長さ ${lineLength} cmの正方形の面積は ${lineLength *
        2} 平方ｃｍです`
    });
  }
  render() {
    return (
      <div>
        <h2>This is a RenderPropsComponent</h2>
        {this.props.render(this.state.text)}
      </div>
    );
  }
}
