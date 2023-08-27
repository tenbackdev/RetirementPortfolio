const express = require('express');
const app = express();
const port = 5501;
const bodyParser = require('body-parser');
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

app.use(bodyParser.json())

app.post('/acctBalSnshInput', async (req, res) => {
  
  const {acct_id, snsh_dt, acct_bal} = req.body;

  if(!acct_id || !snsh_dt || !acct_bal) {
    return res.status(400).json({error: 'All parameters are required.'});
  }

  try {
    await sql.connect(config);
    const sqlReq = new sql.Request();

    sqlReq.input('acct_id', sql.Int, acct_id);
    sqlReq.input('snsh_dt', sql.Date, new Date(snsh_dt));
    sqlReq.input('acct_bal', sql.Decimal(12,2), acct_bal);
    
    const result = await sqlReq.execute('invest.dat.usp_update_acct_bal_snsh');

    console.log(result);

    return res.json({message: 'Successfully submitted.'})

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({error: 'An error occurred.'})
  } finally {
    sql.close();
  }

});

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
            type: result.recordset[0].x_type,
            key: result.recordset[0].x_key,
            scale: result.recordset[0].x_scale,
            domainType: result.recordset[0].x_domainType,
            tickFormat: result.recordset[0].x_tickFormat,
            tick: result.recordset[0].x_tick,
            tickSize: result.recordset[0].x_tickSize
          },
          y: {
            type: result.recordset[0].y_type,
            key: result.recordset[0].y_key,
            scale: result.recordset[0].y_scale,
            domainType: result.recordset[0].y_domainType,
            tickFormat: result.recordset[0].y_tickFormat,
            tick: result.recordset[0].y_tick,
            tickSize: result.recordset[0].y_tickSize
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
  