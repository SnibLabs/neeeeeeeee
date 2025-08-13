class EntityManager {
    constructor() {
        this.entities = [];
        this.toAdd = [];
        this.toRemove = new Set();
    }

    add(entity) {
        this.toAdd.push(entity);
    }

    remove(entity) {
        this.toRemove.add(entity);
    }

    update(dt, gameScene) {
        for (const e of this.entities) {
            if (!this.toRemove.has(e) && e.update) {
                e.update(dt, gameScene);
            }
        }
        // Remove entities marked for deletion
        this.entities = this.entities.filter(e => !this.toRemove.has(e));
        this.toRemove.clear();
        // Add new entities
        this.entities.push(...this.toAdd);
        this.toAdd = [];
    }

    render(ctx, camera) {
        for (const e of this.entities) {
            if (e.render) e.render(ctx, camera);
        }
    }

    getEntitiesByType(type) {
        return this.entities.filter(e => e.type === type);
    }

    clearAll() {
        this.entities = [];
        this.toAdd = [];
        this.toRemove.clear();
    }
}
window.EntityManager = EntityManager;