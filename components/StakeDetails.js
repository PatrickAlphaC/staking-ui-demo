// how many tokens are in our wallet
// how many tokens are staked
// how many tokens we have earned
import { useMoralis, useWeb3Contract } from "react-moralis"
import { stakingAddress, stakingAbi, rewardTokenAbi, rewardTokenAddress } from "../constants"
import { useState, useEffect } from "react"
import { ethers } from "ethers"

export default function StakeDetails() {
    const { account, isWeb3Enabled } = useMoralis()
    const [rtBalance, setRtBalance] = useState("0")
    const [stakedBalance, setStakedBalance] = useState("0")
    const [earnedBalance, setEarned] = useState("0")

    const { runContractFunction: getRtBalance } = useWeb3Contract({
        abi: rewardTokenAbi,
        contractAddress: rewardTokenAddress,
        functionName: "balanceOf",
        params: {
            account: account,
        },
    })

    const { runContractFunction: getStakedBalance } = useWeb3Contract({
        abi: stakingAbi,
        contractAddress: stakingAddress,
        functionName: "getStaked",
        params: {
            account: account,
        },
    })

    const { runContractFunction: getEarned } = useWeb3Contract({
        abi: stakingAbi,
        contractAddress: stakingAddress,
        functionName: "earned",
        params: {
            account: account,
        },
    })

    useEffect(() => {
        // update the UI and get balances
        if (isWeb3Enabled && account) {
            updateUiValues()
        }
    }, [account, isWeb3Enabled])

    async function updateUiValues() {
        const rtBalanceFromContract = (
            await getRtBalance({ onError: (error) => console.log(error) })
        ).toString()
        const formatttedRtBalanceFromContract = ethers.utils.formatUnits(
            rtBalanceFromContract,
            "ether"
        )
        setRtBalance(formatttedRtBalanceFromContract)

        const stakedFromContract = (
            await getStakedBalance({ onError: (error) => console.log(error) })
        ).toString()
        const formatttedstakedFromContract = ethers.utils.formatUnits(stakedFromContract, "ether")
        setStakedBalance(formatttedstakedFromContract)

        const earnedFromContract = (
            await getEarned({ onError: (error) => console.log(error) })
        ).toString()

        console.log(`Earned: ${earnedFromContract}`)

        const formatttedEarnedFromContract = ethers.utils.formatUnits(earnedFromContract, "ether")
        setEarned(formatttedEarnedFromContract)
    }

    return (
        <div>
            <div>RT Balance is: {rtBalance}</div>
            <div>Earned Balance is: {earnedBalance}</div>
            <div>Staked Balance is: {stakedBalance}</div>
        </div>
    )
}
