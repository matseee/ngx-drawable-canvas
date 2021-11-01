import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Point } from '../models/point.model';
import { RenderSettings } from '../models/render-settings';
import { Line } from './../models/line.model';
import { Rect } from './../models/rect.model';
import { RenderService } from './render.service';

describe('RenderService', () => {
  describe('with canvasRef', () => {
    let render: RenderService;
    let canvas: HTMLCanvasElement;
    let canvasRef: ElementRef<HTMLCanvasElement>;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      render = TestBed.inject(RenderService);

      canvas = document.createElement('canvas');
      canvasRef = new ElementRef(canvas);

      render.initialize(canvasRef);
    });

    it('should be created', () => {
      expect(render).toBeTruthy();
    });

    it('should be initialized with an canvasReferance', () => {
      // tslint:disable-next-line: no-string-literal
      expect(render['canvasRef']).toBeTruthy();
      // tslint:disable-next-line: no-string-literal
      expect(render['context']).toBeTruthy();
    });

    it('should render a line', () => {
      const line = new Line(
        new Point(0, 0),
        new Point(50, 50)
      );
      expect(render.line(line)).toBe(true);
    });

    it('should render a line with width 10px and color #ffffff', () => {
      const line = new Line(
        new Point(0, 0),
        new Point(50, 50)
      );

      const renderSettings = new RenderSettings();
      renderSettings.width = 10;
      renderSettings.color = '#ffffff';

      render.line(line, renderSettings);
      // tslint:disable-next-line: no-string-literal
      expect(render['context'].lineWidth).toBe(10);
      // tslint:disable-next-line: no-string-literal
      expect(render['context'].strokeStyle).toBe('#ffffff');
    });

    it('should render a line with linedash-segments [5,3]', () => {
      const line = new Line(
        new Point(0, 0),
        new Point(50, 50)
      );

      const renderSettings = new RenderSettings();
      renderSettings.width = 10;
      renderSettings.color = '#ffffff';
      renderSettings.lineDashSegments = [5, 3];

      render.line(line, renderSettings);
      // tslint:disable-next-line: no-string-literal
      expect(render['context'].getLineDash()).toEqual([5, 3]);
    });

    it('should render a rect', () => {
      const rect = new Rect(
        new Point(10, 10),
        new Point(50, 50)
      );

      expect(render.rect(rect)).toBe(true);
    });
  });

  describe('without canvasRef', () => {
    let render: RenderService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      render = TestBed.inject(RenderService);
    });

    it('should not render a line', () => {
      const line = new Line(
        new Point(0, 0),
        new Point(50, 50)
      );
      expect(render.line(line)).toBe(false);
    });

    it('should not render a rect', () => {
      const rect = new Rect(
        new Point(10, 10),
        new Point(50, 50)
      );

      expect(render.rect(rect)).toBe(false);
    });
  });
});
