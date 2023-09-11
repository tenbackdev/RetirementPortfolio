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
    //sql.close();
  }

});

app.post('/transInput', async (req, res) => {
  
  const {trans_dt, acct_id, ticker, trans_type, trans_price, trans_qty, trans_amt, trans_comm} = req.body;

  if(!trans_dt || !acct_id || !ticker || !trans_type || !trans_price || !trans_qty || !trans_amt || !trans_comm) {
    return res.status(400).json({error: 'All parameters are required.'});
  }

  try {
    await sql.connect(config);
    const sqlReq = new sql.Request();

    sqlReq.input('trans_dt', sql.Date, new Date(trans_dt));
    sqlReq.input('acct_id', sql.Int, acct_id);
    sqlReq.input('ticker', sql.VarChar(5), ticker);
    sqlReq.input('trans_type', sql.VarChar(20), trans_type);
    sqlReq.input('trans_price', sql.Decimal(7,2), trans_price);
    sqlReq.input('trans_qty', sql.Decimal(10,5), trans_qty);
    sqlReq.input('trans_amt', sql.Decimal(7,2), trans_amt);
    sqlReq.input('trans_comm', sql.Decimal(7,2), trans_comm);
    
    const result = await sqlReq.execute('invest.dat.usp_update_acct_trans');

    console.log(result);

    return res.json({message: 'Successfully submitted transaction.'})

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({error: 'An error occurred.'})
  } finally {
    //sql.close();
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
      //sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/tickers', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    // Execute the SQL query
    const query = 'select * from invest.rpt.v_ticker';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        // Return the query results as JSON
        res.json(result.recordset);
      }

      // Close the SQL Server connection
      //sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/transTypes', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    // Execute the SQL query
    const query = 'select * from invest.rpt.v_trans_type';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        // Return the query results as JSON
        res.json(result.recordset);
      }

      // Close the SQL Server connection
      //sql.close();
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
        //sql.close();
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
        //sql.close();
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
        //sql.close();
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
        //sql.close();
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
      //sql.close();
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
      //sql.close();
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
      //sql.close();
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
          },
          line: {
            fill: result.recordset[0].line_fill,
            stroke: result.recordset[0].line_stroke,
            'stroke-width': result.recordset[0].line_strokeWidth
          }
        }
        
        // Return the query results as JSON
        res.json(chartConfig);
      }

      // Close the SQL Server connection
      //sql.close();
    });
  });
});

// Define the endpoint for executing the SQL query
app.get('/getChartConfigBeta/:chartId', (req, res) => {
  // Connect to the SQL Server
  sql.connect(config, err => {
    if (err) {
      console.log('Error connecting to SQL Server:', err);
      res.status(500).json({ error: 'Error connecting to SQL Server' });
      return;
    }

    const chartId = req.params.chartId;
    // Execute the SQL query
    const query = `select * from invest.util.chart_style_settings as s where s.chart_nm = '${chartId}'`;
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        
        const chartConfig = {}

        console.log(result);
        console.log('hi')
        console.log(result.recordset)
        for (const row in result.recordset) {

          const curRow = result.recordset[row]
          console.log(`1: ${curRow.style_nm}, 2: ${curRow.style_prop}, 3: ${curRow.style_val}`);
          if (!chartConfig[curRow.style_nm]) {
            chartConfig[curRow.style_nm] = curRow.style_prop ? {} : curRow.style_val;
          }

          if (curRow.style_prop) {
            if (!chartConfig[curRow.style_nm][curRow.style_prop]) {
              chartConfig[curRow.style_nm][curRow.style_prop] = curRow.style_val;
            }
          }
        }
        
        // Return the query results as JSON
        res.json(chartConfig);
      }

      // Close the SQL Server connection
      //sql.close();
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
        //sql.close();
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
  