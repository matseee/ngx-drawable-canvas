import { RenderSettings } from './render-settings';

describe('RenderSettings', () => {
  let renderSetting: RenderSettings;
  let renderingContext: CanvasRenderingContext2D;

  beforeEach(() => {
    const canvasElement = document.createElement('canvas');
    renderingContext = canvasElement.getContext('2d');

    renderSetting = new RenderSettings();
    renderSetting.width = 1;
    renderSetting.color = '#ffffff';
  });


  it('should create an instance', () => {
    expect(renderSetting).toBeTruthy();
    expect(renderSetting.cap).toBe('round');
    expect(renderSetting.width).toBe(1);
    expect(renderSetting.color).toBe('#ffffff');
  });

  it('should set the settings to the given rendering context', () => {
    renderingContext = renderSetting.set(renderingContext);

    expect(renderingContext.lineCap).toBe('round');
    expect(renderingContext.lineWidth).toBe(1);
    expect(renderingContext.strokeStyle).toBe('#ffffff');
  });

  it('should set the line to dashed with segments (5,3)', () => {
    renderSetting.lineDashSegments = [5, 3];
    renderingContext = renderSetting.set(renderingContext);

    expect(renderSetting.lineDashSegments).toEqual([5, 3]);
    expect(renderingContext.getLineDash()).toEqual([5, 3]);
  });

});
