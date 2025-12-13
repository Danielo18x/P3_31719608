export default class ProductsBuilder {
    constructor(){ 
        this._where = {};
        this._take = 20;
        this._skip = 0;
        this._include = {
            tags: {include: {tag: true}},
            category: true,
        };
        this._orderBy = {id: "asc"};
    }   
    //paginacion
    setPagination(page) {
        const pg = Math.max(1, parseInt(page) || 1);
        this._skip = (pg - 1) * this._take;
        this._page = pg;
        return this;
    }

     //filtro por categoria
    filterByCategory(category) {
        if (!category) return this;

        const catId = parseInt(category);
        if (!isNaN(catId)) {
            this._where.categoryId = catId;
        } else {
            this._where.category = { name: { contains: category.toString() } };
        }
        return this;
    }
    //filtro por tags
    filterByTags(tagsp) {
        if (!tagsp) return this;

        let ids = [];
        if (Array.isArray(tagsp)) {
            ids = tagsp.map(t => parseInt(t)).filter(n => !isNaN(n));
        } else if (typeof tagsp === "string") {
            ids = tagsp.split(",").map(t => parseInt(t)).filter(n => !isNaN(n));
        }

        if (ids.length > 0) {
            this._where.tags = { some: { tagId: { in: ids } } };
        }

        return this;
    }
    //filtro por precio
    filterByPrice(min, max) {
        const pmin = parseInt(min);
        const pmax = parseInt(max);

        if (!isNaN(pmin) || !isNaN(pmax)) {
            this._where.price = {};
            if (!isNaN(pmin)) this._where.price.gte = pmin;
            if (!isNaN(pmax)) this._where.price.lte = pmax;
        }
        return this;
    }
    //filtro por busqueda
    filterBySearch(search) {
        if (search) {
            this._where.OR = [
                { name: { contains: search.toString() } },
                { description: { contains: search.toString() } }
            ];
        }
        return this;

    }
    //filtro de Rango de edad
    filterByAge(ageRange) {
        if (ageRange) {
            const age = parseInt(ageRange);
            if (!isNaN(age)) {
                this._where.ageRange = { lte: age };
            }
        }
        return this;
    }
    //filtro por stock
    filterByStock(stock) {
        if (stock) {
            const stk = parseInt(stock);
            if (!isNaN(stk)) {
                this._where.stock = { gte: stk };
            }
        }
        return this;
    }
    //filtro por sku
    filterBySku(sku) {
        if (sku) {
            this._where.sku = { contains: sku.toString() };
        }
        return this;
    }
    //deovuleve el objeto de consulta
    build() {
        return {
            prismaQuery: {
                where: this._where,
                skip: this._skip,
                take: this._take,
                include: this._include,
                orderBy: this._orderBy,
            },
            meta: {
                page: this._page
            }
        };
    }
} 