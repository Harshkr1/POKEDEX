jest.mock("./pool", () => ({
  query: jest.fn(),
  end: jest.fn(),
}));

const db = require("./query");
const pool = require("./pool");

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await pool.end();
});

describe("Pokemon DB Tests (Mocked)", () => {
  test("Insert Type", async () => {
    pool.query.mockResolvedValue({});
    const res = await db.insertIntoType({
      typeName: "electric",
      colorInHexForm: "#F8D030",
    });
    expect(pool.query).toHaveBeenCalled();
  });

  test("Get Type ID", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
    const id = await db.getTypeID("electric");
    expect(id).toBe(1);
  });

  test("Insert Pokemon", async () => {
    pool.query.mockResolvedValue({});
    const res = await db.insertIntoPokemon({
      name: "pikachu",
      pokedex_number: 25,
      description: "Electric mouse",
      height: 4,
      weight: 60,
      base_experience: 112,
      sprite_url: "pikachu.png",
      hp: 35,
      attack: 55,
      defense: 40,
      special_attack: 50,
      special_defense: 50,
      speed: 90,
      generation: 1,
      is_legendary: false,
    });
    expect(pool.query).toHaveBeenCalled();
  });

  test("Get Pokemon ID", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1 }] });
    const id = await db.getPokemonID("pikachu");
    expect(id).toBe(1);
  });

  test("Insert Pokemon Type", async () => {
    pool.query.mockResolvedValue({});
    await db.insertIntoPokemonType({ pokemonID: 1, typeID: 1 });
    expect(pool.query).toHaveBeenCalled();
  });

  test("Get Pokemon", async () => {
    pool.query.mockResolvedValue({ rows: [{ name: "pikachu" }] });
    const pokemon = await db.getPokemon("pikachu");
    expect(pokemon.name).toBe("pikachu");
  });

  test("Get Pokemon Types", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // getPokemonID
      .mockResolvedValueOnce({ rows: [{ type_id: 1 }] }) // pokemon_types
      .mockResolvedValueOnce({ rows: [{ type: "electric" }] }); // types

    const types = await db.getTypeOfPokemon("pikachu");
    expect(types).toContain("electric");
  });

  test("Get All Pokemon of Type", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // getTypeID
      .mockResolvedValueOnce({ rows: [{ pokemon_id: 1 }] }) // join
      .mockResolvedValueOnce({ rows: [{ name: "pikachu" }] }); // pokemon

    const list = await db.getAllPokemonOfType("electric");
    expect(list).toContain("pikachu");
  });

  test("Get Image URL", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ sprite_url: "pikachu.png" }] });

    const url = await db.getImageURLofPokemon("pikachu");
    expect(url).toBe("pikachu.png");
  });

  test("Get Pokemon Detail", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ name: "pikachu" }] });

    const detail = await db.getPokemonDetail("pikachu");
    expect(detail.name).toBe("pikachu");
  });

  test("Get All Types", async () => {
    pool.query.mockResolvedValue({ rows: [{ type: "electric" }] });
    const types = await db.getAllTypeList();
    expect(types).toContain("electric");
  });

  test("Get All Pokemon", async () => {
    pool.query.mockResolvedValue({ rows: [{ name: "pikachu" }] });
    const list = await db.getAllPokemonList();
    expect(list).toContain("pikachu");
  });

  test("Count Pokemon of Type", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ count: "1" }] });

    const count = await db.getNumberOfPokemonOfType("electric");
    expect(count).toBe(1);
  });

  test("Delete Pokemon", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({});

    await db.deletePokemon("pikachu");
    expect(pool.query).toHaveBeenCalled();
  });

  test("Delete Type", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({});

    await db.deleteType("electric");
    expect(pool.query).toHaveBeenCalled();
  });
});
