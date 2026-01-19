export const checkModelExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Model not found: ${path}`);
    return false;
  }
};

export const getAvailableModels = async (): Promise<string[]> => {
  const modelPaths = [
    '/models/phongthinghiem.glb',
    '/models/table.glb',
    '/models/lab_equipment.glb',
    '/models/shelf.glb'
  ];
  
  const availableModels: string[] = [];
  
  for (const path of modelPaths) {
    if (await checkModelExists(path)) {
      availableModels.push(path);
    }
  }
  
  return availableModels;
};