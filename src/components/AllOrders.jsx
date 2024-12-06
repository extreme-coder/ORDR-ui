import React, { useEffect } from "react";
import { useGetEntitiesByShapeQuery } from "../services/lastmeal";
import styles from "./styles/AllOrders.module.css";
import "./styles/AllOrders.css";
//import socket from '../sockets/socket';
import { refetchTime } from "../constants";

const AllOrders = ({ type, tableId }) => {
  const { data: orders, refetch } = useGetEntitiesByShapeQuery({
    name: "order",
    populate: true,
    shape: [
      ["teacher", "seat", "table"],
      ["items", "item", "toppings"],
    ],
  });

  console.log("orderz", orders);

  /* time status are colours */
  const urgent =
    "#F1B6B6"; /* for orders that have been sitting more than 7 mins */
  const soon =
    "#F8D8BB"; /* for orders that have been sitting more than 4 mins */
  const normal =
    "#F4F4F4"; /* for orders that have been sitting less than 4 mins */

  const getTimeStatus = (time) => {
    const currentTime = new Date();
    const cookedTime = new Date(time);
    const diff = currentTime - cookedTime;

    if (diff > 7 * 60 * 1000) {
      return urgent;
    } else if (diff > 4 * 60 * 1000) {
      return soon;
    } else {
      return normal;
    }
  };
  /*
  const orders = [
    {
      id: 1,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now()).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher1",
              seat: {
                data: {
                  attributes: {
                    number: 11,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [
          { name: "Crepes", toppings: ["chocolate", "strawberry"] },
          { name: "English Breakfast", toppings: ["Sausage", "White"] },
        ],
      },
    },
    {
      id: 2,
      attributes: {
        status: "UNFINISHED",
        type: "FOOD",
        teacher: {
          data: {
            attributes: {
              name: "teacher2",
              seat: {
                data: {
                  attributes: {
                    number: 11,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [
          { name: "Crepes", toppings: ["chocolate", "strawberry", "banannas"] },
          { name: "English Breakfast", toppings: ["Sausage", "White"] },
        ],
      },
    },
    {
      id: 3,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher3",
              seat: {
                data: {
                  attributes: {
                    number: 11,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Eggnog", toppings: [] }],
      },
    },
    {
      id: 4,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher4",
              seat: {
                data: {
                  attributes: {
                    number: 3,
                    table: { data: { attributes: { number: 1 } }, number: 11 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Eggnog", toppings: [] }],
      },
    },
    {
      id: 5,
      attributes: {
        status: "SERVED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher5",
              seat: {
                data: {
                  attributes: {
                    number: 7,
                    table: { data: { attributes: { number: 1 } }, number: 3 },
                  },
                },
              },
            },
          },
        },
        order_items: [
          { name: "Pancakes", toppings: ["honey", "butter"] },
          { name: "Fresh Juice", toppings: [] },
        ],
      },
    },
    {
      id: 6,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher6",
              seat: {
                data: {
                  attributes: {
                    number: 9,
                    table: { data: { attributes: { number: 1 } }, number: 2 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Latte", toppings: ["whipped cream"] }],
      },
    },
    {
      id: 7,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher7",
              seat: {
                data: {
                  attributes: {
                    number: 1,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Waffles", toppings: ["strawberries", "cream"] }],
      },
    },
    {
      id: 8,
      attributes: {
        status: "SERVED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher8",
              seat: {
                data: {
                  attributes: {
                    number: 5,
                    table: { data: { attributes: { number: 1 } }, number: 3 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Soda", toppings: [] }],
      },
    },
    {
      id: 9,
      attributes: {
        status: "UNFINISHED",
        type: "FOOD",
        teacher: {
          data: {
            attributes: {
              name: "teacher9",
              seat: {
                data: {
                  attributes: {
                    number: 8,
                    table: { data: { attributes: { number: 12 } }, number: 2 },
                  },
                },
              },
            },
          },
        },
        order_items: [
          { name: "Toast", toppings: ["avocado", "tomato"] },
          { name: "Tea", toppings: ["lemon"] },
        ],
      },
    },
    {
      id: 10,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher10",
              seat: {
                data: {
                  attributes: {
                    number: 4,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Mocha", toppings: ["whipped cream"] }],
      },
    },
    {
      id: 11,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher11",
              seat: {
                data: {
                  attributes: {
                    number: 6,
                    table: { data: { attributes: { number: 1 } }, number: 3 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Omelette", toppings: ["cheese", "ham"] }],
      },
    },
    {
      id: 12,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher12",
              seat: {
                data: {
                  attributes: {
                    number: 10,
                    table: { data: { attributes: { number: 1 } }, number: 2 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Fruit Smoothie", toppings: ["honey"] }],
      },
    },
    {
      id: 13,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher13",
              seat: {
                data: {
                  attributes: {
                    number: 2,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [
          { name: "Sandwich", toppings: ["lettuce", "tomato"] },
          { name: "Chips", toppings: [] },
        ],
      },
    },
    {
      id: 14,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher14",
              seat: {
                data: {
                  attributes: {
                    number: 3,
                    table: { data: { attributes: { number: 1 } }, number: 3 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Water", toppings: [] }],
      },
    },
    {
      id: 15,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher15",
              seat: {
                data: {
                  attributes: {
                    number: 9,
                    table: { data: { attributes: { number: 1 } }, number: 2 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Salad", toppings: ["croutons", "cheese"] }],
      },
    },
    {
      id: 16,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 0 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher16",
              seat: {
                data: {
                  attributes: {
                    number: 5,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Hot Chocolate", toppings: ["marshmallows"] }],
      },
    },
    {
      id: 17,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 0 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher17",
              seat: {
                data: {
                  attributes: {
                    number: 1,
                    table: { data: { attributes: { number: 1 } }, number: 3 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Burger", toppings: ["cheese", "bacon"] }],
      },
    },
    {
      id: 18,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 0 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher18",
              seat: {
                data: {
                  attributes: {
                    number: 8,
                    table: { data: { attributes: { number: 1 } }, number: 2 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Iced Tea", toppings: ["lemon"] }],
      },
    },
    {
      id: 19,
      attributes: {
        status: "PREPARED",
        type: "FOOD",
        time_cooked: new Date(Date.now() - 0 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher19",
              seat: {
                data: {
                  attributes: {
                    number: 4,
                    table: { data: { attributes: { number: 1 } }, number: 1 },
                  },
                },
              },
            },
          },
        },
        order_items: [{ name: "Grilled Cheese", toppings: ["tomato soup"] }],
      },
    },
    {
      id: 20,
      attributes: {
        status: "PREPARED",
        type: "DRINK",
        time_cooked: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        teacher: {
          data: {
            attributes: {
              name: "teacher20",
              seat: {
                data: {
                  attributes: {
                    number: 6,
                    table: { data: { attributes: { number: 1 } }, number: 3 },
                  },
                },
              },
            },
          },
        },
      },
    },
  ];*/

  const filtered =
    orders &&
    orders.data &&
    orders.data
      .filter((o) => o.attributes.status === type)
      .filter((o) =>
        tableId
          ? o.attributes.teacher.data.attributes.seat.data.attributes.table.data
              .attributes.number === tableId
          : true
      )
      .sort(
        (a, b) =>
          new Date(a.attributes.time_cooked) -
          new Date(b.attributes.time_cooked)
      );

  /*(useEffect(() => {
    const interval = setInterval(() => {
      console.log("refetch");
      refetch();
    }, refetchTime);

    return () => clearInterval(interval);
  }, [refetch]);*/

  return (
    <div className={styles.allOrders}>
      {tableId ? (
        <div className={styles.heading}>
          <div className={styles.Hcell}>Location</div>
          <div className={styles.Hcell}>Seat</div>
          <div className={styles.Hcell}>Teacher</div>
          <div className={styles.Hcell}>Items</div>
        </div>
      ) : (
        <div className={styles.heading}>
          <div className={styles.Hcell2}>Location</div>
          <div className={styles.Hcell2}>Table</div>
          <div className={styles.Hcell2}>Seat</div>
          <div className={styles.Hcell2}>Teacher</div>
          <div className={styles.Hcell2}>Items</div>
        </div>
      )}

      {filtered &&
        filtered.map((order) => (
          <div
            className={styles.row}
            style={
              order.attributes.time_cooked && {
                backgroundColor: getTimeStatus(order.attributes.time_cooked),
              }
            }
          >
            <div className={tableId ? styles.cell : styles.cell2}>
              {order.attributes.type}
            </div>
            {!tableId && (
              <div className={styles.cell2}>
                {
                  order.attributes.teacher.data.attributes.seat.data.attributes
                    .table.data.attributes.number
                }
              </div>
            )}
            <div className={tableId ? styles.cell : styles.cell2}>
              {
                order.attributes.teacher.data.attributes.seat.data.attributes
                  .number
              }
            </div>
            <div className={tableId ? styles.cell : styles.cell2}>
              {order.attributes.teacher.data.attributes.name}
            </div>
            <div className={tableId ? styles.cell : styles.cell2}>
              {order.attributes &&
                order.attributes.items &&
                order.attributes.items.data &&
                order.attributes.items.data.map((item) => (
                  <div>
                    <span style={{ fontWeight: "800" }}>
                      {item &&
                        item.attributes &&
                        item.attributes.item &&
                        item.attributes.item.data &&
                        item.attributes.item.data.attributes &&
                        item.attributes.item.data.attributes.name}
                    </span>

                    {item.attributes.item.data.attributes.toppings.data.length >
                      0 && (
                      <span style={{ color: "#5394B7" }}>
                        {` w/${item.attributes.item.data.attributes.toppings.data.map(
                          (topping) => " " + topping.attributes.name
                        )}`}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllOrders;

/*<div
      className={styles[`ao-container`]}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {!tableId ? (
        <table class="orders">
          <tr class="ao-heading">
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Pickup at</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Teacher</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Table</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Seat</h5>
            </th>
            <th class="sticky">
              <h5 className={styles[`table-heading`]}>Item</h5>
            </th>
          </tr>

          {orders &&
            orders.data
              .filter((o) => o.attributes.status === type)
              .map((o) => (
                <>
                  {o.attributes.items.split(",").map((item) => (
                    <tr class="ao-row">
                      <td class={`ao-item-${type} first`}>
                        {o.attributes.type}
                      </td>
                      <td class={`ao-item-${type}`}>
                        {o.attributes.teacher.data.attributes.name}
                      </td>
                      <td class={`ao-item-${type}`}>
                        {o.attributes.teacher.data.attributes.seat.data
                          ? o.attributes.teacher.data.attributes.seat.data
                              .attributes.table.data.attributes.number
                          : ""}
                      </td>
                      <td class={`ao-item-${type}`}>
                        {o.attributes.teacher.data.attributes.seat.data
                          ? o.attributes.teacher.data.attributes.seat.data
                              .attributes.number
                          : ""}
                      </td>
                      <td class={`ao-item-${type} last`}>{item}</td>
                    </tr>
                  ))}
                </>
              ))}
        </table>
      ) : (
        <div>
          <h3>Prepared Items</h3>
          <table class="orders">
            <tr class="ao-heading">
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Pickup at</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Teacher</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Table</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Seat</h5>
              </th>
              <th class="sticky">
                <h5 className={styles[`table-heading`]}>Item</h5>
              </th>
            </tr>

            {orders &&
              orders.data
                .filter((o) => o.attributes.status === type)
                .map((o) => (
                  <>
                    {o.attributes.items.split(",").map((item) => (
                      <tr class="ao-row">
                        <td class={`ao-item-${type} first`}>
                          {o.attributes.type}
                        </td>
                        <td class={`ao-item-${type}`}>
                          {o.attributes.teacher.data.attributes.name}
                        </td>
                        <td class={`ao-item-${type}`}>
                          {o.attributes.teacher.data.attributes.seat.data
                            ? o.attributes.teacher.data.attributes.seat.data
                                .attributes.table.data.attributes.number
                            : ""}
                        </td>
                        <td class={`ao-item-${type}`}>
                          {o.attributes.teacher.data.attributes.seat.data
                            ? o.attributes.teacher.data.attributes.seat.data
                                .attributes.number
                            : ""}
                        </td>
                        <td class={`ao-item-${type} last`}>{item}</td>
                      </tr>
                    ))}
                  </>
                ))}
          </table>
        </div>
      )}
    </div>
  );*/
