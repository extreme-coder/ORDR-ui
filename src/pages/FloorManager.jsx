import React, { useEffect, useState } from 'react'
import { useGetEntitiesByDepth2Query, useGetEntitiesQuery } from '../services/lastmeal';
import { useParams } from 'react-router';
import { Button, Col, Container, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { EmptySeat } from '../components/EmptySeat';
import { SeatView } from '../components/SeatView';
import styles from './pageStyles/FloorManager.module.css'
import { SingleTable } from '../components/SingleTable';
import AllOrders from '../components/AllOrders';

const FloorManager = () => {
      const { data: tables } = useGetEntitiesQuery({ name: "table", populate: true });

      const id = useParams().id;
    

      return (
        
          <Tabs>
           
            <Tab  eventKey="1" title="floor">
            <div className={styles[`fm-container`]}>
              <table>
                <tr className={styles[`table-row`]}>
                  <td className={styles[`table-data`]}>
                    
                      {tables && tables.data.filter(t => !id || parseInt(id) === t.attributes.number ).splice(0,4).reverse().map(table => 
                        <div className={styles[`fm-table-container`]}>
                          <SingleTable table={table}></SingleTable> 
                      </div>)}
                  
                    </td>
                    <td className={styles[`table-data`]}>
                    
                      {tables && tables.data.filter(t => !id || parseInt(id) === t.attributes.number ).splice(4,8).map(table => 
                      <div className={styles[`fm-table-container`]}>
                        <SingleTable table={table}></SingleTable>
                    </div>
                    )}
                      
                  </td>
                </tr>
            </table>
          </div>
        </Tab>
        <Tab eventKey="2" title="orders">
          <Tabs>         
          <Tab eventKey="3" title="Ready">     
            <AllOrders type="PREPARED"></AllOrders>
          </Tab>
          <Tab eventKey="4" title="Unprepared">
            <AllOrders type="UNFINISHED"></AllOrders>
          </Tab>
          </Tabs>
          </Tab>
        </Tabs>
        
      )
    
}

export default FloorManager