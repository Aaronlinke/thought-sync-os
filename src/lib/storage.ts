import { Intent, KnowledgeNode, KnowledgeEdge } from '@/types/brain';

const DB_NAME = 'LocalBrainDB';
const DB_VERSION = 1;

class BrainStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('intents')) {
          const intentStore = db.createObjectStore('intents', { keyPath: 'id' });
          intentStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('nodes')) {
          const nodeStore = db.createObjectStore('nodes', { keyPath: 'id' });
          nodeStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('edges')) {
          db.createObjectStore('edges', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveIntent(intent: Intent): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['intents'], 'readwrite');
      const store = transaction.objectStore('intents');
      const request = store.put({ ...intent, timestamp: intent.timestamp.toISOString() });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getIntents(limit = 50): Promise<Intent[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['intents'], 'readonly');
      const store = transaction.objectStore('intents');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');
      
      const intents: Intent[] = [];
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && intents.length < limit) {
          const data = cursor.value;
          intents.push({ ...data, timestamp: new Date(data.timestamp) });
          cursor.continue();
        } else {
          resolve(intents);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveNode(node: KnowledgeNode): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['nodes'], 'readwrite');
      const store = transaction.objectStore('nodes');
      const request = store.put(node);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getNodes(): Promise<KnowledgeNode[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['nodes'], 'readonly');
      const store = transaction.objectStore('nodes');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveEdge(edge: KnowledgeEdge): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['edges'], 'readwrite');
      const store = transaction.objectStore('edges');
      const request = store.put(edge);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getEdges(): Promise<KnowledgeEdge[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['edges'], 'readonly');
      const store = transaction.objectStore('edges');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
}

export const brainStorage = new BrainStorage();
