const db = require('../config/db'); // DB connection

const dashboardController = {
  getDashboard: (req, res) => {
    // Existing queries
    const totalMembersQuery = 'SELECT COUNT(*) AS total_members FROM members';
    const totalShareCapitalQuery = 'SELECT SUM(share_capital) AS total_share_capital FROM members';
    const totalLoansQuery = 'SELECT COUNT(*) AS total_loans FROM loans';
    const loanStatusQuery = `
      SELECT 
        loan_status, 
        COUNT(*) AS status_count 
      FROM loans 
      GROUP BY loan_status
    `;
    const totalLoanAmountQuery = 'SELECT SUM(loan_amount) AS total_loan_amount FROM loans';
    const remainingBalanceQuery = 'SELECT SUM(remaining_balance) AS total_remaining_balance FROM loans';
    const totalProductsQuery = 'SELECT COUNT(*) AS total_products FROM products';
    const inStockProductsQuery = 'SELECT name FROM products WHERE stock > 0';
    const outOfStockProductsQuery = 'SELECT name FROM products WHERE stock = 0';
    const totalOrdersQuery = 'SELECT COUNT(*) AS total_orders FROM orders';
    const totalInventoryValueQuery = 'SELECT SUM(price * stock) AS total_inventory_value FROM products WHERE stock > 0';
    // New queries for the equipment table
    const totalEquipmentQuery = 'SELECT COUNT(*) AS total_equipment FROM equipment';
    const equipmentStatusQuery = `
      SELECT 
        status, 
        COUNT(*) AS status_count 
      FROM equipment 
      GROUP BY status
    `;
    const totalEquipmentValueQuery = 'SELECT SUM(price * stock_quantity) AS total_equipment_value FROM equipment';
    const availableEquipmentQuery = 'SELECT name FROM equipment WHERE status = "available"';
    const rentedEquipmentQuery = 'SELECT name FROM equipment WHERE status = "rented"';
    const maintenanceEquipmentQuery = 'SELECT name FROM equipment WHERE status = "maintenance"';

    // Fetching total members
    db.query(totalMembersQuery, (err, memberResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching total members');
      }

      const totalMembers = memberResult[0].total_members;

      // Fetching total share capital
      db.query(totalShareCapitalQuery, (err, shareResult) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error fetching total share capital');
        }

        const totalShareCapital = parseFloat(shareResult[0].total_share_capital) || 0.0;

        // Fetching total loans
        db.query(totalLoansQuery, (err, loansResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error fetching total loans');
          }

          const totalLoans = loansResult[0].total_loans;

          // Fetching loan statuses
          db.query(loanStatusQuery, (err, statusResult) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Error fetching loan statuses');
            }

            const loanStatuses = statusResult.reduce((acc, row) => {
              acc[row.loan_status] = row.status_count;
              return acc;
            }, {});

            // Fetching total loan amount
            db.query(totalLoanAmountQuery, (err, loanAmountResult) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Error fetching total loan amount');
              }

              const totalLoanAmount = parseFloat(loanAmountResult[0].total_loan_amount) || 0.0;

              // Fetching total remaining balance
              db.query(remainingBalanceQuery, (err, balanceResult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Error fetching total remaining balance');
                }

                const totalRemainingBalance = parseFloat(balanceResult[0].total_remaining_balance) || 0.0;

                // Fetching total products
                db.query(totalProductsQuery, (err, productResult) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send('Error fetching total products');
                  }

                  const totalProducts = productResult[0].total_products;

                  db.query(totalOrdersQuery, (err, ordersResult) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send('Error fetching total orders');
                    }
  
                    const totalOrders = ordersResult[0]?.total_orders || 0;

                  // Fetching in-stock products
                  db.query(inStockProductsQuery, (err, inStockResult) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send('Error fetching in-stock products');
                    }

                    const inStockProducts = inStockResult.map(product => product.name);

                    // Fetching out-of-stock products
                    db.query(outOfStockProductsQuery, (err, outOfStockResult) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).send('Error fetching out-of-stock products');
                      }

                      const outOfStockProducts = outOfStockResult.map(product => product.name);

                      // Fetching total inventory value
                      db.query(totalInventoryValueQuery, (err, inventoryValueResult) => {
                        if (err) {
                          console.error(err);
                          return res.status(500).send('Error fetching total inventory value');
                        }

                        const totalInventoryValue = parseFloat(inventoryValueResult[0].total_inventory_value) || 0.0;

                        // Fetching total equipment
                        db.query(totalEquipmentQuery, (err, equipmentResult) => {
                          if (err) {
                            console.error(err);
                            return res.status(500).send('Error fetching total equipment');
                          }

                          const totalEquipment = equipmentResult[0].total_equipment;

                          // Fetching equipment status breakdown
                          db.query(equipmentStatusQuery, (err, statusResult) => {
                            if (err) {
                              console.error(err);
                              return res.status(500).send('Error fetching equipment statuses');
                            }

                            const equipmentStatuses = statusResult.reduce((acc, row) => {
                              acc[row.status] = row.status_count;
                              return acc;
                            }, {});

                            // Fetching total equipment value
                            db.query(totalEquipmentValueQuery, (err, equipmentValueResult) => {
                              if (err) {
                                console.error(err);
                                return res.status(500).send('Error fetching total equipment value');
                              }

                              const totalEquipmentValue = parseFloat(equipmentValueResult[0].total_equipment_value) || 0.0;

                              // Fetching available equipment
                              db.query(availableEquipmentQuery, (err, availableResult) => {
                                if (err) {
                                  console.error(err);
                                  return res.status(500).send('Error fetching available equipment');
                                }

                                const availableEquipment = availableResult.map(equipment => equipment.name);

                                // Fetching rented equipment
                                db.query(rentedEquipmentQuery, (err, rentedResult) => {
                                  if (err) {
                                    console.error(err);
                                    return res.status(500).send('Error fetching rented equipment');
                                  }

                                  const rentedEquipment = rentedResult.map(equipment => equipment.name);

                                  // Fetching equipment in maintenance
                                  db.query(maintenanceEquipmentQuery, (err, maintenanceResult) => {
                                    if (err) {
                                      console.error(err);
                                      return res.status(500).send('Error fetching equipment in maintenance');
                                    }

                                    const maintenanceEquipment = maintenanceResult.map(equipment => equipment.name);

                                    // Now, bundle all the equipment data into an object
                                    const equipment = {
                                      totalEquipment,
                                      equipmentStatuses,
                                      totalEquipmentValue,
                                      availableEquipment,
                                      rentedEquipment,
                                      maintenanceEquipment,
                                    };

                                    // Render the admin dashboard view
                                    res.render('admin/dashboard', {
                                      totalMembers,
                                      totalShareCapital,
                                      totalLoans,
                                      loanStatuses,
                                      totalLoanAmount,
                                      totalRemainingBalance,
                                      totalProducts,
                                      totalOrders,
                                      inStockProducts,
                                      outOfStockProducts,
                                      totalInventoryValue,
                                      equipment,  // Pass the equipment object to the view
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                  });
                });
              });
            });
          });
        });
      });
    });
  },
};

module.exports = dashboardController;
