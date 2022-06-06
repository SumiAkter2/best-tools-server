import React from 'react';

const AdminOrderDetail = ({ p, handleDelete }) => {
    return (
        <div >
            {/* <p ></p>
            <p className='pl-12'></p>
            <p ></p>
            <p >{p._id}</p>
            <p className='pl-24'></p>
            <p >{p.quantity}</p> */}

            <table>
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>{p.email}</th>
                        <td>{p.name}</td>
                        <td>{p.product_name}</td>
                        <td>{p.price}</td>
                        <td>{p.quantity}</td>
                        <td><button onClick={() => handleDelete(p._id)} className='btn btn-primary'>Delete</button></td>
                    </tr>
                </tbody>

            </table>
            {/* <p>{p._id}</p> */}
        </div>
    );
};

export default AdminOrderDetail;