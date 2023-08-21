const express = require('express');
const app = express();
const port = 5501;
const cors = require("cors");
const sql = require('mssql');


const fs = require('fs');
const dbConfig = JSON.parse(fs.readFileSync('dbConfig.json', 'utf-8'));
const config = {
  user: dbConfig.user,
  password: dbConfig.password,
  server: dbConfig.server,
  database: dbConfig.database,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

app.use(cors({
    Origin: 'http://127.0.0.1'
}));

// Define the endpoint for executing the SQL query
app.get('/acct', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    // Execute the SQL query
    const query = 'select * from invest.rpt.v_acct';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        // Return the query results as JSON
        res.json(result.recordset);
      }

      // Close the SQL Server connection
      sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/acctBalHist', (req, res) => {
    // Connect to the SQL Server
    sql.connect(config, err => {
      if (err) {
        console.log('Error connecting to SQL Server:', err);
        res.status(500).json({ error: 'Error connecting to SQL Server' });
        return;
      }
  
      // Execute the SQL query
      const query = 'select * from invest.rpt.v_acct_bal_snsh';
      new sql.Request().query(query, (err, result) => {
        if (err) {
          console.log('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
        } else {
          // Return the query results as JSON
          res.json(result.recordset);
        }
  
        // Close the SQL Server connection
        sql.close();
      });
    });
  });

// Define the endpoint for executing the SQL query
app.get('/curAcctBal', (req, res) => {
    // Connect to the SQL Server
    sql.connect(config, err => {
      if (err) {
        console.log('Error connecting to SQL Server:', err);
        res.status(500).json({ error: 'Error connecting to SQL Server' });
        return;
      }
  
      // Execute the SQL query
      const query = 'select * from invest.rpt.v_acct_bal_cur';
      new sql.Request().query(query, (err, result) => {
        if (err) {
          console.log('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
        } else {
          // Return the query results as JSON
          res.json(result.recordset);
        }
  
        // Close the SQL Server connection
        sql.close();
      });
    });
  });

// Define the endpoint for executing the SQL query
app.get('/recInc', (req, res) => {
    // Connect to the SQL Server
    sql.connect(config, err => {
      if (err) {
        console.log('Error connecting to SQL Server:', err);
        res.status(500).json({ error: 'Error connecting to SQL Server' });
        return;
      }
  
      // Execute the SQL query
      const query = 'select * from invest.rpt.v_acct_div_trans_rec';
      new sql.Request().query(query, (err, result) => {
        if (err) {
          console.log('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
        } else {
          // Return the query results as JSON
          res.json(result.recordset);
        }
  
        // Close the SQL Server connection
        sql.close();
      });
    });
  });

// Define the endpoint for executing the SQL query
app.get('/curEstInc', (req, res) => {
    // Connect to the SQL Server
    sql.connect(config, err => {
      if (err) {
        console.log('Error connecting to SQL Server:', err);
        res.status(500).json({ error: 'Error connecting to SQL Server' });
        return;
      }
  
      // Execute the SQL query
      const query = 'select * from invest.rpt.v_est_inc_cur';
      new sql.Request().query(query, (err, result) => {
        if (err) {
          console.log('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
        } else {
          // Return the query results as JSON
          res.json(result.recordset);
        }
  
        // Close the SQL Server connection
        sql.close();
      });
    });
  });

// Define the endpoint for executing the SQL query
app.get('/curEstIncAvg', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    // Execute the SQL query
    const query = 'select * from invest.rpt.v_est_inc_cur_avg';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        // Return the query results as JSON
        res.json(result.recordset);
      }

      // Close the SQL Server connection
      sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/histEstIncAvg', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    // Execute the SQL query
    const query = 'select * from invest.rpt.v_est_inc_hist_avg';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        // Return the query results as JSON
        res.json(result.recordset);
      }

      // Close the SQL Server connection
      sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/curEstIncTickerPayDt', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    // Execute the SQL query
    const query = 'select * from invest.rpt.v_est_inc_cur_ticker_pay_dt';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        // Return the query results as JSON
        res.json(result.recordset);
      }

      // Close the SQL Server connection
      sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/getChartConfig/:chartId', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    const chartId = req.params.chartId;
    // Execute the SQL query
    const query = `select * from invest.util.v_chart_style_settings_tsfm as s where s.chart_nm = '${chartId}'`;
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        
        const chartConfig = {
          title: {
            text: result.recordset[0].title_text,
            class: result.recordset[0].title_class,
            margin: {
              top: Number(result.recordset[0].title_marginTop),
              left: Number(result.recordset[0].title_marginLeft)              
            }
          },
          margin: {
            top: Number(result.recordset[0].margin_top),
            right: Number(result.recordset[0].margin_right),
            bottom: Number(result.recordset[0].margin_bottom),
            left: Number(result.recordset[0].margin_left)
          },
          x: {
            type: result.recordset[0].x_type
          }
        }
        
        // Return the query results as JSON
        res.json(chartConfig);
      }

      // Close the SQL Server connection
      sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/executeQuery', (req, res) => {
    // Connect to the SQL Server
    sql.connect(config, err => {
      if (err) {
        console.log('Error connecting to SQL Server:', err);
        res.status(500).json({ error: 'Error connecting to SQL Server' });
        return;
      }
  
      // Execute the SQL query
      const query = 'select * from ad_hoc.lkup.v_execute_query';
      new sql.Request().query(query, (err, result) => {
        if (err) {
          console.log('Error executing query:', err);
          res.status(500).json({ error: 'Error executing query' });
        } else {
          // Return the query results as JSON
          res.json(result.recordset);
        }
  
        // Close the SQL Server connection
        sql.close();
      });
    });
  });

// Define the "executeQuery" endpoint
app.get('/executeQueryOld', (req, res) => {
    // Handle the request and execute the SQL query here
    
    // Return the response to the client
    res.send('Query executed successfully');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  