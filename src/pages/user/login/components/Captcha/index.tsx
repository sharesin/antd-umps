import React, { Component } from 'react';

function getRandomColor() {
  // eslint-disable-next-line no-bitwise
  return `#${`00000${((Math.random() * 0x1000000) << 0).toString(16)}`.substr(-6)}`;
}

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
function randomColor(min: number, max: number) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
}

interface IProps {
  text?: string;
  width: number;
  height: number;
  fontSize: number;
  onClick: (e: any) => void;
}

interface IState {}

export default class PhotoCaptcha extends Component<IProps, IState> {
  private canvas: React.RefObject<HTMLCanvasElement>;

  static defaultProps = {
    width: 100,
    height: 39,
    fontSize: 16,
  };

  constructor(props: Readonly<IProps>) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps: { text: string | undefined }) {
    if (prevProps.text !== this.props.text) {
      this.draw();
    }
  }

  draw() {
    const { text, width, height, fontSize } = this.props;
    if (text && this.canvas.current !== null) {
      const ctx = this.canvas.current.getContext('2d');
      if (ctx !== null) {
        ctx.clearRect(0, 0, width, height);
        ctx.font = '28px serif';
        const letters = text.split('');
        const averageWidth = (width - fontSize) / letters.length;
        letters.forEach((letter, index) => {
          const x = averageWidth * index + fontSize / 2;
          const y = (height + fontSize) / 2;
          const radian =
            Math.random() < 0.5
              ? (-Math.PI / 180) * Math.random() * 15
              : (Math.PI / 180) * Math.random() * 15;
          ctx.translate(x, 0);
          ctx.rotate(radian);
          ctx.fillStyle = getRandomColor();
          ctx.fillText(letter, 0, y);
          ctx.rotate(-radian);
          ctx.translate(-x, 0);
        });

        /* 绘制干扰线 */
        for (let i = 0; i < 2; i += 1) {
          ctx.strokeStyle = randomColor(40, 180);
          ctx.beginPath();
          ctx.moveTo(randomNum(0, width), randomNum(0, height));
          ctx.lineTo(randomNum(0, width), randomNum(0, height));
          ctx.stroke();
        }

        /* 绘制干扰点 */
        for (let i = 0; i < width / 10; i += 1) {
          ctx.fillStyle = randomColor(0, 255);
          ctx.beginPath();
          ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  render() {
    const { width, height, onClick } = this.props;
    return (
      <canvas
        style={{
          width: '100%',
          height: `${height}px`,
          border: '1px solid #d9d9d9',
          background: '#fff',
          cursor: 'pointer',
        }}
        ref={this.canvas}
        width={width}
        height={height}
        onClick={onClick}
      />
    );
  }
}
