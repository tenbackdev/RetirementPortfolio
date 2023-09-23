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
    trustServerCertificate: true,
    connectionTimeout: 120000,
    requestTimeout: 60000
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

app.post('/stockDataInput', async (req, res) => {
  
  const {myJson} = req.body;

  console.log(myJson)

  if(!myJson) {
    return res.status(400).json({error: 'All parameters are required.'});
  }

  try {
    await sql.connect(config);
    const sqlReq = new sql.Request();

    sqlReq.input('json', sql.NVarChar(sql.MAX), `${myJson}`);

    const result = await sqlReq.execute('invest.dat.usp_update_ticker_price');

    return res.json({message: 'Successfully submitted stock data.'})

    //setTimeout(5000);

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

    const query = `select * from invest.util.v_chart_cfg_tsfm as e where e.chart_nm = '${chartId}'`

    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
      } else {
        var chartConfigJSON = {}

        for (var i = 0; i < result.recordset.length; i++) {
          if (!chartConfigJSON[result.recordset[i]['obj_nm']]) {
            chartConfigJSON[result.recordset[i]['obj_nm']] = {}
          }
          
          var attr_val_nbr = parseInt(result.recordset[i]['attr_val'], 10)

          if (result.recordset[i]['attr_dtl']) {
            if (!chartConfigJSON[result.recordset[i]['obj_nm']][result.recordset[i]['attr_nm']]) {
              chartConfigJSON[result.recordset[i]['obj_nm']][result.recordset[i]['attr_nm']] = {}
            }        
            if (attr_val_nbr > 0 || attr_val_nbr <= 0) {
              chartConfigJSON[result.recordset[i]['obj_nm']][result.recordset[i]['attr_nm']][result.recordset[i]['attr_dtl']] = attr_val_nbr
            } else {
              chartConfigJSON[result.recordset[i]['obj_nm']][result.recordset[i]['attr_nm']][result.recordset[i]['attr_dtl']] = `${result.recordset[i]['attr_val']}`
            }    
            
          } else {
            //console.log(`Orig: ${result.recordset[i]['attr_val']}, Attempt: ${parseInt(result.recordset[i]['attr_val'], 10)}, Eval: ${parseInt(result.recordset[i]['attr_val'], 10) > 0}`)
            if (attr_val_nbr > 0 || attr_val_nbr <= 0) {
              chartConfigJSON[result.recordset[i]['obj_nm']][result.recordset[i]['attr_nm']] = attr_val_nbr
            } else {
              chartConfigJSON[result.recordset[i]['obj_nm']][result.recordset[i]['attr_nm']] = `${result.recordset[i]['attr_val']}`
            }
          }
        }
        
        // Return the query results as JSON
        res.json(chartConfigJSON);
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  