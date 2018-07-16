import React, { Component } from 'react'
import moment from 'moment';
import ThemeColor from 'env/_themeColor';
import numeral from 'numeral';

export default class Cursor extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { mousePosition, scales, mouseOverData, range, offsetRight, svgDimensions, margins, revenueReporting } = this.props;
    const { xScaleTime } = scales;
    const { meta } = mouseOverData ? mouseOverData : {};
    const [ mouseX ] = mousePosition;
    const { widht, height } = svgDimensions;

    const metaBoxWidth = meta ? this._measureMetaBoxSize(meta, mouseOverData) : 0;
    const timeBoxWidth = this._determineWidth(range);

    const timeValue = xScaleTime.invert(mouseX);
    const timeFormat = this._determineTimeFormat(range);

    const flip = offsetRight <= metaBoxWidth;

    const cursorY = -height - 30;
    const timeBoxY = -height + 90;

    return (
      <g transform={`translate(${mouseX}, 194)`}>
        <rect 
          fill='#888'
          x={0}
          y={cursorY}
          width={1}
          height={height - margins.top - 10} />
        { 
          meta && meta.length > 0 &&
          <g transform={`translate(${this._determineX(flip, metaBoxWidth)}, 0)`}>
            <rect
              fill='rgba(255,255,255,0.8)'
              stroke='#ddd'
              x={8}
              y={cursorY}
              height={18 * (meta.length + 1 ) + 3 }
              width={metaBoxWidth} />

            { this._getMetaInfo(mouseOverData, flip, metaBoxWidth, height, revenueReporting) }
          </g>
        }
        <g transform={`translate(${this._determineX(flip, timeBoxWidth)}, 0)`}>
          <rect
            fill='#fff'
            stroke='#ddd'
            x={8}
            y={timeBoxY}
            height={22}
            width={timeBoxWidth} />
          <text
            fill='#555'
            x={14}
            y={timeBoxY + 16}
            fontSize={`12px`}>
            {moment(timeValue).format(timeFormat)}
          </text>
        </g>

      </g>
    )
  }

  _determineX(flip, boxWidth) {
    const offset = 16;
    return flip ? (0 - boxWidth - offset) : 0;
  }

  _measureMetaBoxSize(meta, mouseOverData) {
    let width = 0;
    meta.forEach((info, idx) => {
      const text = `${this._capitalizeFirstChar(info.type)}: ${info.count}`;
      width = Math.max(width, text.length * 7)
    })

    const totalAmountSum = `Total Amount: ${this._prettifyAmount(mouseOverData.transactions.totalAmountSum)}`;
    width = Math.max(width, totalAmountSum.length * 7)

    return width;
  }

  _getMetaInfo(meta, flip, metaBoxWidth, height, revenueReporting) {

    let metas = [];
    const info = meta.transactions;
    const x = 16;
    const y = - height - 14;
    let base = 0;

    if (revenueReporting && info.totalAmountSum > 0) {
      base = 1;
      metas.push(
        <g>
          <rect fill='#9CDE45' width='5px' height='5px' x={x} y={y - 7} />
          <text
            key='meta-amount'
            fill='#555'
            x={x + 10}
            y={y}
            fontSize={`12px`}>
            <tspan>Total Amount</tspan>: <tspan fontWeight='bold'>{this._prettifyAmount(info.totalAmountSum)}</tspan>
          </text>
        </g>
      );
    }

    const test = ['transactions', 'motions', 'bookmarks'];

    test.forEach((type, idx) => {
      const info = meta[type];

      if (info.type && info.count > 0) {
        metas.push(
          <g key={idx}>
            <rect fill={this._getLegendColor(type)}  width='5px' height='5px' x={x} y={y + (idx + base) * 16 - 7} />
            <text
              key={`meta-${type}`}
              fill='#555'
              x={x + 10}
              y={y + (idx + base) * 16}
              fontSize={`12px`}>
              <tspan>{this._capitalizeFirstChar(info.type)}</tspan>: <tspan fontWeight='bold'>{info.count}</tspan>
            </text>
          </g>
        );
      }
    });

    return metas;
  }

  _prettifyAmount(value) {
    const [ language ] = navigator.language.split('-');
    numeral.locale(language);
    numeral.defaultFormat('$0,0.00');

    return numeral(parseInt(value)).format();
  }

  _capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _getLegendColor(type) {
    switch(type) {
      case 'motions':
        return ThemeColor['blue-6'];
        break;

      case 'transactions':
        return ThemeColor['green-5'];
        break;

      case 'bookmarks':
        return ThemeColor['orange-4'];
        break;
    }
  }

  _determineTimeFormat(range) {
    switch(range) {
      case 'Day':
        return 'HH:mm:ss';
        break;

      case 'Week':
      case 'Month':
      case 'Year':
        return 'll';
        break;
    }
  }

  _determineWidth(range) {
    switch(range) {
      case 'Day':
        return 60;
        break;

      case 'Week':
      case 'Month':
      case 'Year':
        return 80;
        break;
    }
  }
}