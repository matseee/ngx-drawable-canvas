import { CanvasSettings } from './canvas-settings';
import { Offset } from './offset.model';

describe('CanvasSettings', () => {
  let canvasSettings: CanvasSettings;

  beforeEach(() => {
    canvasSettings = new CanvasSettings();
  });

  it('should create an instance', () => {
    expect(canvasSettings).toBeTruthy();
    expect(canvasSettings.width).toBe(0);
    expect(canvasSettings.height).toBe(0);
    expect(canvasSettings.offset.left).toBe(0);
    expect(canvasSettings.offset.top).toBe(0);
  });

  it('should have a width of 1000 and height of 500', () => {
    canvasSettings = new CanvasSettings(1000, 500);
    expect(canvasSettings.width).toBe(1000);
    expect(canvasSettings.height).toBe(500);
  });

  it('should have an offset of 120,120', () => {
    canvasSettings = new CanvasSettings(1000, 500, new Offset(120, 120));
    expect(canvasSettings.offset.left).toBe(120);
    expect(canvasSettings.offset.top).toBe(120);
  });
});
