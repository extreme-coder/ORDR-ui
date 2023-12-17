import React, { useEffect, useState } from 'react'
import { useGetEntitiesByDepth2Query, useGetEntitiesQuery } from '../services/lastmeal';
import { useParams } from 'react-router';
import { Button, Col, Container, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { EmptySeat } from '../components/EmptySeat';
import { SeatView } from '../components/SeatView';
import styles from './pageStyles/FloorManager.module.css'
import { SingleTable } from '../components/SingleTable';

const FloorManager = () => {
      const { data: tables } = useGetEntitiesQuery({ name: "table", populate: true });

      const id = useParams().id;
    
    

      return (
        <div className={styles[`fm-container`]}>
          <Tabs>
            <Tab>
              <div class="container">
                <div class="row">
                  <div class="col-auto">
                    
                      {tables && tables.data.filter(t => !id || parseInt(id) === t.attributes.number ).splice(0,4).reverse().map(table => 
                        <div className={styles[`fm-table-container`]}>
                          <SingleTable table={table}></SingleTable> 
                      </div>)}
                  
                    </div>
                    <div class="col-auto">
                    
                      {tables && tables.data.filter(t => !id || parseInt(id) === t.attributes.number ).splice(4,8).map(table => 
                      <div className={styles[`fm-table-container`]}>
                        <SingleTable table={table}></SingleTable>
                    </div>
                    )}
                      
                  </div>
                </div>
            </div>
        </Tab>
        </Tabs>
        </div>
      )
    
}

export default FloorManager