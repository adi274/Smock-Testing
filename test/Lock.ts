
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { FakeContract, smock, MockContractFactory, MockContract } from '@defi-wonderland/smock';
import { BigNumber } from "ethers";
import {expect} from 'chai'
import chai = require('chai')

import {
Lock,
Lock__factory
} from '../typechain-types'


import {deployMockContract} from '@ethereum-waffle/mock-contract';
import { Artifact } from "hardhat/types";


describe("Testing Mock", async () => {
  var myMock: MockContract<Lock>;
  const HashID = 0;
  const ONE_GWEI = 1_000_000_000;
  let mockLockFactory: MockContractFactory<Lock__factory>

  before(async() => {
     mockLockFactory = await smock.mock("Lock");

  })

  beforeEach("Setup", async () => {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    myMock = await mockLockFactory.deploy(unlockTime, {
      value: ONE_GWEI
    });
   
  })
  describe("testing smock", () => {
    it("should mock the Lock", async () => {
      const batchId = 1
      const fastMessage = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000959922be3caee4b8cd9a407cc3ac1c251c2007b1000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000447596c3dd0000000000000000000000000b306bf915c4d645ff596e518faf3f9669b970160000000000000000000000000000000000000000000000000000000000000461'
      
      myMock.withdraw.reverts("revert sendBatch")
      
      // should revert with "something went wrong"
      await expect(
        myMock.withdraw()
      ).to.be.revertedWith("revert sendBatch");

      myMock.claim.whenCalledWith(HashID, ethers.constants.HashZero, {value: ONE_GWEI}).reverts("revert Claim")
      // should be reverted
      await expect(
        myMock.claim(HashID, ethers.constants.HashZero, {value: ONE_GWEI})
      ).to.be.revertedWith("revert Claim");

      myMock.verifyAndRelayMessage.whenCalledWith(batchId, [], fastMessage).returns(3)
      // should return 2, instead of normally returning 1.
      const returnValue = await myMock.verifyAndRelayMessage(batchId, [], fastMessage);
      await expect(
        returnValue
      ).to.equal(3)


    })
  })
})





